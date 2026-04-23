from django.db import models

class Customer(models.Model):
    customer_phone = models.CharField(max_length=32, verbose_name='customer_phone')
    customer_name = models.CharField(max_length=100, verbose_name='customer_name')
    email = models.CharField(max_length=100, verbose_name='email', null=True, blank=True)
    country_code = models.CharField(max_length=50, verbose_name='country_code', null=True, blank=True)
    default_address = models.CharField(max_length=255, verbose_name='default_address', null=True, blank=True)
    marketing_agree = models.SmallIntegerField(verbose_name='marketing_agree', default=0)
    privacy_agree = models.SmallIntegerField(verbose_name='privacy_agree', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'customer'
        verbose_name = 'customer'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Store(models.Model):
    store_code = models.CharField(max_length=64, verbose_name='store_code')
    store_name = models.CharField(max_length=100, verbose_name='store_name')
    store_type = models.CharField(max_length=64, verbose_name='store_type', null=True, blank=True)
    store_address = models.CharField(max_length=255, verbose_name='store_address', null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6, verbose_name='latitude', null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, verbose_name='longitude', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'store'
        verbose_name = 'store'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Product(models.Model):
    product_code = models.CharField(max_length=64, verbose_name='product_code')
    product_name = models.CharField(max_length=200, verbose_name='product_name')
    product_category = models.CharField(max_length=64, verbose_name='product_category', null=True, blank=True)
    market_date = models.DateField(verbose_name='market_date', null=True, blank=True)
    part_keep_until = models.DateField(verbose_name='part_keep_until', null=True, blank=True)
    stock_location = models.CharField(max_length=100, verbose_name='stock_location', null=True, blank=True)
    part_stock_location = models.CharField(max_length=100, verbose_name='part_stock_location', null=True, blank=True)
    safe_stock_threshold = models.IntegerField(verbose_name='safe_stock_threshold', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'product'
        verbose_name = 'product'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Part(models.Model):
    part_code = models.CharField(max_length=64, verbose_name='part_code')
    part_name = models.CharField(max_length=200, verbose_name='part_name')
    color = models.CharField(max_length=50, verbose_name='color', null=True, blank=True)
    specification = models.CharField(max_length=100, verbose_name='specification', null=True, blank=True)
    stock_location = models.CharField(max_length=100, verbose_name='stock_location', null=True, blank=True)
    default_qty = models.IntegerField(verbose_name='default_qty', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'part'
        verbose_name = 'part'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class Warehouse(models.Model):
    warehouse_code = models.CharField(max_length=64, verbose_name='warehouse_code')
    warehouse_name = models.CharField(max_length=100, verbose_name='warehouse_name')
    warehouse_type = models.CharField(max_length=64, verbose_name='warehouse_type', null=True, blank=True)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'warehouse'
        verbose_name = 'warehouse'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysUser(models.Model):
    user_no = models.CharField(max_length=64, verbose_name='user_no')
    username = models.CharField(max_length=100, verbose_name='username')
    full_name = models.CharField(max_length=100, verbose_name='full_name')
    job_title = models.CharField(max_length=100, verbose_name='job_title', null=True, blank=True)
    department = models.CharField(max_length=100, verbose_name='department', null=True, blank=True)
    phone = models.CharField(max_length=100, verbose_name='phone', null=True, blank=True)
    email = models.CharField(max_length=100, verbose_name='email', null=True, blank=True)
    country_code = models.CharField(max_length=50, verbose_name='country_code', null=True, blank=True)
    office_address = models.CharField(max_length=255, verbose_name='office_address', null=True, blank=True)
    effective_date = models.DateField(verbose_name='effective_date', null=True, blank=True)
    expire_date = models.DateField(verbose_name='expire_date', null=True, blank=True)
    ip_match_mode = models.CharField(max_length=10, verbose_name='ip_match_mode', null=True, blank=True)
    allowed_ip = models.CharField(max_length=255, verbose_name='allowed_ip', null=True, blank=True)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'sys_user'
        verbose_name = 'sys_user'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysRole(models.Model):
    role_code = models.CharField(max_length=64, verbose_name='role_code')
    role_name = models.CharField(max_length=100, verbose_name='role_name')
    role_type = models.CharField(max_length=64, verbose_name='role_type', null=True, blank=True)
    role_desc = models.TextField(verbose_name='role_desc', null=True, blank=True)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'sys_role'
        verbose_name = 'sys_role'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysPermission(models.Model):
    permission_code = models.CharField(max_length=64, verbose_name='permission_code')
    permission_name = models.CharField(max_length=100, verbose_name='permission_name')
    permission_type = models.CharField(max_length=32, verbose_name='permission_type')
    parent = models.ForeignKey('SysPermission', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='parent_id', null=True, blank=True)
    permission_path = models.CharField(max_length=255, verbose_name='permission_path', null=True, blank=True)
    component_path = models.CharField(max_length=255, verbose_name='component_path', null=True, blank=True)
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    is_visible = models.SmallIntegerField(verbose_name='is_visible', default=1)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    permission_desc = models.TextField(verbose_name='permission_desc', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'sys_permission'
        verbose_name = 'sys_permission'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class PartConfig(models.Model):
    part = models.ForeignKey('Part', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='part_id')
    qty_type = models.CharField(max_length=64, verbose_name='qty_type')
    qty_name = models.CharField(max_length=100, verbose_name='qty_name')
    default_qty = models.IntegerField(verbose_name='default_qty', default=0)
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'part_config'
        verbose_name = 'part_config'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WarehouseLocation(models.Model):
    warehouse = models.ForeignKey('Warehouse', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='warehouse_id')
    location_code = models.CharField(max_length=64, verbose_name='location_code')
    location_name = models.CharField(max_length=100, verbose_name='location_name')
    location_type = models.CharField(max_length=32, verbose_name='location_type', null=True, blank=True)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'warehouse_location'
        verbose_name = 'warehouse_location'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysUserRole(models.Model):
    user_id = models.BigIntegerField(verbose_name='user_id')
    role_id = models.BigIntegerField(verbose_name='role_id')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'sys_user_role'
        verbose_name = 'sys_user_role'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysRolePermission(models.Model):
    role_id = models.BigIntegerField(verbose_name='role_id')
    permission_id = models.BigIntegerField(verbose_name='permission_id')
    is_granted = models.SmallIntegerField(verbose_name='is_granted', default=1)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'sys_role_permission'
        verbose_name = 'sys_role_permission'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


