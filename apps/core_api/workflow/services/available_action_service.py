from django.db import transaction
from django.utils import timezone

from tickets.models import TicketAvailableAction
from workflow.models import WfAction, WfTransition


class AvailableActionService:
    @staticmethod
    @transaction.atomic
    def refresh(*, ticket):
        TicketAvailableAction.objects.filter(ticket=ticket).delete()

        transitions = WfTransition.objects.filter(
            biz_type="TICKET",
            from_status_code=ticket.biz_status_code,
            status="ENABLED",
            is_system_only=0,
        ).order_by("priority", "id")

        action_codes = [item.action_code for item in transitions]

        actions = {
            item.action_code: item
            for item in WfAction.objects.filter(
                biz_type="TICKET",
                action_code__in=action_codes,
                status="ENABLED",
            )
        }

        rows = []

        for transition in transitions:
            action = actions.get(transition.action_code)
            if not action:
                continue

            rows.append(
                TicketAvailableAction(
                    ticket=ticket,
                    action_code=action.action_code,
                    action_name=action.action_name,
                    source_status_code=ticket.biz_status_code,
                    is_enabled=1,
                    generated_at=timezone.now(),
                )
            )

        if rows:
            TicketAvailableAction.objects.bulk_create(rows)

        return rows
