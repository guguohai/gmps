from master_data.models import SysUser


class OperatorService:
    @staticmethod
    def resolve(operator):
        if not operator or not getattr(operator, "is_authenticated", False):
            return None

        username = getattr(operator, "username", None)
        email = getattr(operator, "email", None)

        if username:
            sys_user = SysUser.objects.filter(username=username, status="ENABLED").first()
            if sys_user:
                return sys_user

        if email:
            return SysUser.objects.filter(email=email, status="ENABLED").first()

        return None
