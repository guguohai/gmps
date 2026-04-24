from django.urls import path

from .views import MiniAppTicketDetailView

urlpatterns = [
    path("miniapp/tickets/<str:ticket_no>/detail", MiniAppTicketDetailView.as_view(), name="miniapp_ticket_detail"),
]
