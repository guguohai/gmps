from decimal import Decimal

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from surveys.models import SurveyTask
from workflow.models import WfStatus

from .models import (
    Ticket,
    TicketConsultation,
    TicketConsultationAttachment,
    TicketFulfillment,
    TicketInboundLogistics,
    TicketPayment,
    TicketProgress,
    TicketRepair,
    TicketSnapshot,
)


def _dt(value):
    return value.isoformat() if value else None


def _date(value):
    return value.isoformat() if value else None


def _decimal(value):
    if value is None:
        return None
    if isinstance(value, Decimal):
        return str(value)
    return value


def _status_name(status, language):
    if not status:
        return None
    if language == "en":
        return status.status_name_en or status.status_name
    if language == "ko":
        return status.status_name_ko or status.status_name
    return status.status_name


def _success(data):
    return Response({"code": 200, "message": "success", "data": data})


def _error(code, message, http_status=200):
    return Response({"code": code, "message": message, "data": None}, status=http_status)


class MiniAppTicketDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, ticket_no):
        mobile = request.query_params.get("mobile")
        language = request.query_params.get("language", "zh-CN")

        if not mobile:
            return _error(400, "mobile is required")

        ticket = (
            Ticket.objects.select_related("customer", "product")
            .filter(ticket_no=ticket_no, is_deleted=0)
            .first()
        )
        if not ticket:
            return _error(404, "ticket not found")

        snapshot = TicketSnapshot.objects.filter(ticket=ticket).first()
        customer_phone = (
            snapshot.customer_phone
            if snapshot
            else (ticket.customer.customer_phone if ticket.customer_id else None)
        )
        if customer_phone != mobile:
            return _error(403, "ticket does not belong to this mobile")

        status = WfStatus.objects.filter(
            biz_type="TICKET",
            status_code=ticket.biz_status_code,
            status="ENABLED",
        ).first()

        repair = TicketRepair.objects.filter(ticket=ticket).first()
        payment = TicketPayment.objects.filter(ticket=ticket).order_by("-id").first()
        fulfillment = TicketFulfillment.objects.filter(ticket=ticket).first()
        inbound_logistics = TicketInboundLogistics.objects.filter(ticket=ticket).first()

        data = {
            "ticketNo": ticket.ticket_no,
            "status": ticket.biz_status_code,
            "displayStatus": ticket.customer_status_code,
            "statusDesc": _status_name(status, language) or ticket.biz_status_code,
            "progressStage": status.progress_node_code if status else None,
            "serviceProgress": self._build_service_progress(ticket),
            "timeNodes": self._build_time_nodes(ticket, payment, fulfillment),
            "productName": self._product_name(ticket, snapshot),
            "issueDescription": snapshot.customer_request if snapshot else None,
            "judgementResult": self._judgement_result(ticket),
            "repairContent": repair.repair_content if repair else None,
            "expectedOutboundDate": _date(repair.expected_outbound_date) if repair else None,
            "returnMode": self._return_mode(fulfillment),
            "returnAddressText": self._return_address(snapshot, fulfillment),
            "canModifyReturnMode": self._can_modify_return(ticket),
            "canModifyReturnAddress": self._can_modify_return(ticket),
            "canCancel": ticket.biz_status_code in {"WAIT_RECEIVE", "RECEIVED"},
            "actions": self._build_actions(ticket),
            "payment": self._build_payment(ticket, payment, repair),
            "confirmation": self._build_confirmation(ticket),
            "survey": self._build_survey(ticket),
            "logistics": self._build_logistics(fulfillment, inbound_logistics),
            "progressRecords": self._build_progress_records(ticket),
        }

        return _success(data)

    def _product_name(self, ticket, snapshot):
        if snapshot and snapshot.product_name:
            return snapshot.product_name
        if ticket.product_id:
            return ticket.product.product_name
        return None

    def _judgement_result(self, ticket):
        if ticket.biz_status_code in {"JUDGED_FREE", "REPAIRING", "WAIT_PARTS", "WAIT_OUTBOUND"}:
            return "FREE" if ticket.current_payment_status in {None, "", "NO_PAY"} else None
        if ticket.biz_status_code in {"JUDGED_PAID", "WAIT_PAYMENT", "PAYMENT_COMPLETED"}:
            return "PAID"
        return None

    def _return_mode(self, fulfillment):
        if not fulfillment:
            return None
        if fulfillment.delivery_method == "STORE_PICKUP":
            return "STORE"
        if fulfillment.delivery_method:
            return "HOME"
        return None

    def _return_address(self, snapshot, fulfillment):
        if fulfillment and fulfillment.delivery_method == "STORE_PICKUP":
            return snapshot.receive_store_name if snapshot else None
        return snapshot.receive_address if snapshot else None

    def _can_modify_return(self, ticket):
        return ticket.biz_status_code in {
            "WAIT_APPLY_REVIEW",
            "WAIT_RECEIVE",
            "RECEIVED",
            "JUDGED_FREE",
            "JUDGED_PAID",
            "WAIT_PAYMENT",
            "PAYMENT_COMPLETED",
            "REPAIRING",
            "WAIT_PARTS",
        }

    def _build_actions(self, ticket):
        actions = []
        if ticket.biz_status_code == "WAIT_RECEIVE":
            actions.append({"actionCode": "SUBMIT_SHIPPING", "actionName": "提交寄件信息", "enabled": True})
        if ticket.biz_status_code == "WAIT_PAYMENT":
            actions.append({"actionCode": "PAY", "actionName": "去支付", "enabled": True})
        if ticket.biz_status_code in {"WAIT_RECEIVE", "RECEIVED"}:
            actions.append({"actionCode": "CANCEL", "actionName": "取消工单", "enabled": True})
        pending_confirmation = TicketConsultation.objects.filter(
            ticket=ticket,
            need_customer_confirm=1,
            status="WAIT_CONFIRM",
        ).exists()
        if pending_confirmation:
            actions.append({"actionCode": "CONFIRM", "actionName": "处理确认事项", "enabled": True})

        survey = SurveyTask.objects.filter(ticket=ticket, survey_status="PENDING", allow_submit=1).exists()
        if survey:
            actions.append({"actionCode": "SUBMIT_SURVEY", "actionName": "填写问卷", "enabled": True})

        return actions

    def _build_payment(self, ticket, payment, repair):
        has_pending = ticket.biz_status_code == "WAIT_PAYMENT" or (
            payment and payment.payment_status in {"UNPAID", "PENDING", "WAIT_PAYMENT"}
        )
        return {
            "hasPendingPayment": bool(has_pending),
            "canPay": ticket.biz_status_code == "WAIT_PAYMENT",
            "paymentNo": payment.payment_order_no if payment else None,
            "paymentStatus": payment.payment_status if payment else ticket.current_payment_status,
            "amount": _decimal(payment.payment_amount if payment else (repair.repair_fee_amount if repair else None)),
            "currency": payment.currency_code if payment else (repair.currency_code if repair else None),
            "feeDescription": repair.repair_reference_note if repair else None,
            "paymentDeadline": _date(payment.payment_deadline) if payment else None,
            "paymentTime": _dt(payment.paid_at) if payment else None,
        }

    def _build_confirmation(self, ticket):
        records = list(
            TicketConsultation.objects.filter(ticket=ticket, need_customer_confirm=1)
            .order_by("-launched_at", "-id")
        )
        pending = [item for item in records if item.status == "WAIT_CONFIRM"]
        current = pending[0] if pending else None
        images = []
        if current:
            images = [
                {
                    "fileName": item.file_name,
                    "fileUrl": item.file_url,
                    "attachmentType": item.attachment_type,
                }
                for item in TicketConsultationAttachment.objects.filter(consultation=current).order_by("sort_no", "id")
            ]
        return {
            "hasPendingConfirmation": bool(pending),
            "pendingCount": len(pending),
            "currentTaskNo": current.consultation_no if current else None,
            "currentTaskStatus": current.status if current else None,
            "currentTaskTitle": current.subject if current else None,
            "currentTaskContent": current.content if current else None,
            "currentImages": images,
            "currentCreatedTime": _dt(current.launched_at) if current else None,
            "currentHandledTime": _dt(current.confirmed_at) if current else None,
            "records": [
                {
                    "taskNo": item.consultation_no,
                    "status": item.status,
                    "title": item.subject,
                    "content": item.content,
                    "createdTime": _dt(item.launched_at),
                    "handledTime": _dt(item.confirmed_at),
                    "confirmResult": item.customer_confirm_result,
                }
                for item in records
            ],
        }

    def _build_survey(self, ticket):
        survey = SurveyTask.objects.filter(ticket=ticket).order_by("-id").first()
        pending = bool(survey and survey.survey_status == "PENDING")
        return {
            "hasPendingSurvey": pending,
            "canViewSurvey": bool(survey),
            "canSubmit": bool(survey and survey.allow_submit == 1 and survey.survey_status == "PENDING"),
            "surveyNo": survey.survey_no if survey else None,
            "surveyTitle": survey.survey_title if survey else None,
            "surveyStatus": survey.survey_status if survey else None,
            "deadlineTime": _dt(survey.deadline_at) if survey else None,
        }

    def _build_logistics(self, fulfillment, inbound_logistics):
        carrier = None
        tracking_no = None
        if fulfillment and fulfillment.tracking_no:
            carrier = fulfillment.carrier_name
            tracking_no = fulfillment.tracking_no
        elif inbound_logistics:
            carrier = inbound_logistics.carrier_name
            tracking_no = inbound_logistics.tracking_no

        return {
            "hasLogistics": bool(carrier or tracking_no),
            "carrier": carrier,
            "trackingNo": tracking_no,
            "logisticsStatus": fulfillment.delivery_status if fulfillment else None,
            "shippedTime": _dt(fulfillment.outbound_completed_at) if fulfillment else None,
            "deliveredTime": _dt(fulfillment.delivered_at or fulfillment.signed_at) if fulfillment else None,
            "storeArrivedTime": _dt(fulfillment.store_arrived_at) if fulfillment else None,
            "hasFullTracking": bool(fulfillment and fulfillment.delivery_status in {"DELIVERED", "SIGNED"}),
        }

    def _build_service_progress(self, ticket):
        return [
            {
                "progressType": item.progress_type,
                "title": item.progress_title,
                "content": item.progress_content,
                "eventTime": _dt(item.progress_time),
            }
            for item in TicketProgress.objects.filter(ticket=ticket, is_customer_visible=1).order_by("progress_time", "id")
        ]

    def _build_progress_records(self, ticket):
        return [
            {
                "recordNo": str(item.id),
                "recordType": item.progress_type,
                "title": item.progress_title,
                "content": item.progress_content,
                "eventTime": _dt(item.progress_time),
            }
            for item in TicketProgress.objects.filter(ticket=ticket, is_customer_visible=1).order_by("-progress_time", "-id")
        ]

    def _build_time_nodes(self, ticket, payment, fulfillment):
        nodes = [
            {"nodeCode": "APPLY", "nodeName": "申请时间", "nodeTime": _dt(ticket.created_at)},
        ]
        if ticket.last_action_at:
            nodes.append({"nodeCode": "LAST_ACTION", "nodeName": "最近处理时间", "nodeTime": _dt(ticket.last_action_at)})
        if payment and payment.paid_at:
            nodes.append({"nodeCode": "PAYMENT", "nodeName": "支付时间", "nodeTime": _dt(payment.paid_at)})
        if fulfillment and fulfillment.outbound_completed_at:
            nodes.append({"nodeCode": "OUTBOUND", "nodeName": "发货时间", "nodeTime": _dt(fulfillment.outbound_completed_at)})
        if ticket.service_completed_at:
            nodes.append({"nodeCode": "COMPLETED", "nodeName": "完成时间", "nodeTime": _dt(ticket.service_completed_at)})
        if ticket.closed_at:
            nodes.append({"nodeCode": "CLOSED", "nodeName": "关闭时间", "nodeTime": _dt(ticket.closed_at)})
        return nodes
