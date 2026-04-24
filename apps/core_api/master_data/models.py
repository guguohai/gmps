from django.db import models


class Customer(models.Model):
    id = models.BigAutoField(primary_key=True)
    customer_phone = models.CharField(max_length=32)
    customer_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, null=True, blank=True)
    country_code = models.CharField(max_length=50, null=True, blank=True)
    default_address = models.CharField(max_length=255, null=True, blank=True)
    marketing_agree = models.SmallIntegerField(default=0)
    privacy_agree = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customer'
        constraints = [
            models.UniqueConstraint(fields=['customer_phone'], name='uk_customer_phone'),
        ]
        verbose_name = 'customer'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Store(models.Model):
    id = models.BigAutoField(primary_key=True)
    store_code = models.CharField(max_length=64)
    store_name = models.CharField(max_length=100)
    store_type = models.CharField(max_length=64, null=True, blank=True)
    store_address = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'store'
        constraints = [
            models.UniqueConstraint(fields=['store_code'], name='uk_store_code'),
        ]
        verbose_name = 'store'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Product(models.Model):
    id = models.BigAutoField(primary_key=True)
    product_code = models.CharField(max_length=64)
    product_name = models.CharField(max_length=200)
    product_category = models.CharField(max_length=64, null=True, blank=True)
    market_date = models.DateField(null=True, blank=True)
    part_keep_until = models.DateField(null=True, blank=True)
    stock_location = models.CharField(max_length=100, null=True, blank=True)
    part_stock_location = models.CharField(max_length=100, null=True, blank=True)
    safe_stock_threshold = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product'
        constraints = [
            models.UniqueConstraint(fields=['product_code'], name='uk_product_code'),
        ]
        verbose_name = 'product'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Part(models.Model):
    id = models.BigAutoField(primary_key=True)
    part_code = models.CharField(max_length=64)
    part_name = models.CharField(max_length=200)
    color = models.CharField(max_length=50, null=True, blank=True)
    specification = models.CharField(max_length=100, null=True, blank=True)
    stock_location = models.CharField(max_length=100, null=True, blank=True)
    default_qty = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'part'
        constraints = [
            models.UniqueConstraint(fields=['part_code'], name='uk_part_code'),
        ]
        verbose_name = 'part'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Warehouse(models.Model):
    id = models.BigAutoField(primary_key=True)
    warehouse_code = models.CharField(max_length=64)
    warehouse_name = models.CharField(max_length=100)
    warehouse_type = models.CharField(max_length=64, null=True, blank=True)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'warehouse'
        constraints = [
            models.UniqueConstraint(fields=['warehouse_code'], name='uk_warehouse_code'),
        ]
        verbose_name = 'warehouse'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_no = models.CharField(max_length=64)
    username = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    country_code = models.CharField(max_length=50, null=True, blank=True)
    office_address = models.CharField(max_length=255, null=True, blank=True)
    effective_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    ip_match_mode = models.CharField(max_length=10, null=True, blank=True)
    allowed_ip = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sys_user'
        constraints = [
            models.UniqueConstraint(fields=['user_no'], name='uk_sys_user_user_no'),
        ]
        verbose_name = 'sys_user'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysRole(models.Model):
    id = models.BigAutoField(primary_key=True)
    role_code = models.CharField(max_length=64)
    role_name = models.CharField(max_length=100)
    role_type = models.CharField(max_length=64, null=True, blank=True)
    role_desc = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sys_role'
        constraints = [
            models.UniqueConstraint(fields=['role_code'], name='uk_sys_role_role_code'),
        ]
        verbose_name = 'sys_role'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysPermission(models.Model):
    id = models.BigAutoField(primary_key=True)
    permission_code = models.CharField(max_length=64)
    permission_name = models.CharField(max_length=100)
    permission_type = models.CharField(max_length=32)
    parent = models.ForeignKey('SysPermission', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    permission_path = models.CharField(max_length=255, null=True, blank=True)
    component_path = models.CharField(max_length=255, null=True, blank=True)
    sort_no = models.IntegerField(default=0)
    is_visible = models.SmallIntegerField(default=1)
    status = models.CharField(max_length=32, default='ENABLED')
    permission_desc = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sys_permission'
        constraints = [
            models.UniqueConstraint(fields=['permission_code'], name='uk_sys_permission_permission_code'),
        ]
        indexes = [
            models.Index(fields=['parent'], name='idx_sys_permission_parent_id'),
        ]
        verbose_name = 'sys_permission'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class PartConfig(models.Model):
    id = models.BigAutoField(primary_key=True)
    part = models.ForeignKey('Part', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    qty_type = models.CharField(max_length=64)
    qty_name = models.CharField(max_length=100)
    default_qty = models.IntegerField(default=0)
    sort_no = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'part_config'
        indexes = [
            models.Index(fields=['part'], name='idx_part_config_part_id'),
        ]
        verbose_name = 'part_config'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WarehouseLocation(models.Model):
    id = models.BigAutoField(primary_key=True)
    warehouse = models.ForeignKey('Warehouse', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    location_code = models.CharField(max_length=64)
    location_name = models.CharField(max_length=100)
    location_type = models.CharField(max_length=32, null=True, blank=True)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'warehouse_location'
        constraints = [
            models.UniqueConstraint(fields=['warehouse', 'location_code'], name='uk_warehouse_location_warehouse_code'),
        ]
        indexes = [
            models.Index(fields=['warehouse'], name='idx_warehouse_location_warehouse_id'),
        ]
        verbose_name = 'warehouse_location'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysUserRole(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    role = models.ForeignKey('SysRole', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sys_user_role'
        constraints = [
            models.UniqueConstraint(fields=['user', 'role'], name='uk_sys_user_role_user_role'),
        ]
        indexes = [
            models.Index(fields=['role'], name='idx_sys_user_role_role_id'),
        ]
        verbose_name = 'sys_user_role'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysRolePermission(models.Model):
    id = models.BigAutoField(primary_key=True)
    role = models.ForeignKey('SysRole', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    permission = models.ForeignKey('SysPermission', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    is_granted = models.SmallIntegerField(default=1)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sys_role_permission'
        constraints = [
            models.UniqueConstraint(fields=['role', 'permission'], name='uk_sys_role_permission_role_permission'),
        ]
        indexes = [
            models.Index(fields=['permission'], name='idx_sys_role_permission_permission_id'),
        ]
        verbose_name = 'sys_role_permission'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)
