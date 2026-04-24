from rest_framework import serializers


class TicketApplicationSerializer(serializers.Serializer):
    source_request_no = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    apply_channel = serializers.CharField(required=False, default="MINI_PROGRAM")

    customer_phone = serializers.CharField()
    customer_name = serializers.CharField()
    customer_email = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    country_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    receive_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    receive_address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    receive_channel_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    receive_channel = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    receive_store_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    receive_store_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    purchase_date = serializers.DateField(required=False, allow_null=True)
    purchase_channel = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    customer_request = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    product_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    product_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    product_category = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    has_purchase_proof = serializers.IntegerField(required=False, default=0)
    has_accessories = serializers.IntegerField(required=False, default=0)
    has_warranty_card = serializers.IntegerField(required=False, default=0)
    accessory_types_json = serializers.JSONField(required=False)
    privacy_agree = serializers.IntegerField(required=False, default=0)
    marketing_agree = serializers.IntegerField(required=False, default=0)
    remark = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class TicketActionSerializer(serializers.Serializer):
    action_code = serializers.CharField()
    remark = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    payload = serializers.JSONField(required=False)
