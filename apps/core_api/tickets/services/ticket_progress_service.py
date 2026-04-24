from django.utils import timezone

from tickets.models import TicketProgress


class TicketProgressService:
    @staticmethod
    def create_by_status(*, ticket, status, operator=None, trigger_type="MANUAL"):
        if not status.progress_node_code:
            return None

        return TicketProgress.objects.create(
            ticket=ticket,
            progress_time=timezone.now(),
            progress_type=status.progress_node_code,
            progress_title=status.status_name,
            progress_content=status.status_name,
            source_type=trigger_type,
            is_customer_visible=1,
            created_by=operator,
        )
