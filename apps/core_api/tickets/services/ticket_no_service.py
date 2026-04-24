from django.utils import timezone

from tickets.models import Ticket


class TicketNoService:
    @staticmethod
    def next_ticket_no():
        today = timezone.localtime().strftime("%Y%m%d")
        prefix = f"TK{today}"

        latest = (
            Ticket.objects
            .filter(ticket_no__startswith=prefix)
            .order_by("-ticket_no")
            .first()
        )

        if not latest:
            return f"{prefix}0001"

        seq = int(latest.ticket_no[-4:]) + 1
        return f"{prefix}{seq:04d}"
