from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from master_data.models import SysPermission, SysRolePermission, SysUser, SysUserRole


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True)
    password = serializers.CharField(required=True, allow_blank=False, trim_whitespace=False)
    remember = serializers.BooleanField(required=False, default=False)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(request=request, username=username, password=password)
        if user is None:
            return Response(
                {"code": status.HTTP_401_UNAUTHORIZED, "message": "用户名或密码错误"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        user_profile = SysUser.objects.filter(username=username).first()
        user_id = str(user_profile.id if user_profile else user.id)
        real_name = (
            (user_profile.full_name if user_profile else "")
            or user.get_full_name()
            or user.username
        )

        roles = []
        permissions = []

        if user_profile:
            role_ids = list(
                SysUserRole.objects.filter(user=user_profile)
                .values_list("role_id", flat=True)
            )
            if role_ids:
                roles = list(
                    SysUserRole.objects.filter(user=user_profile)
                    .select_related("role")
                    .values_list("role__role_code", flat=True)
                    .distinct()
                )

                permission_ids = SysRolePermission.objects.filter(
                    role_id__in=role_ids, is_granted=1
                ).values_list("permission_id", flat=True)
                permissions = list(
                    SysPermission.objects.filter(id__in=permission_ids)
                    .values_list("permission_code", flat=True)
                    .distinct()
                )

        if not roles:
            roles = ["admin"] if user.is_superuser else []

        expires_in_delta: timedelta = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        expires_in = int(expires_in_delta.total_seconds())

        return Response(
            {
                "code": status.HTTP_200_OK,
                "message": "success",
                "data": {
                    "token": str(access_token),
                    "expiresIn": expires_in,
                    "user": {
                        "userId": user_id,
                        "username": user.username,
                        "realName": real_name,
                        "roles": roles,
                        "permissions": permissions,
                    },
                },
            },
            status=status.HTTP_200_OK,
        )
