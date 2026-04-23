import os
import re

directory = r'c:\Users\guoha\Workspace\gm-ps\UIUX\UI\v2'
files = [f for f in os.listdir(directory) if f.endswith('.html')]

# The target files that belong to the Inventory Management group
inventory_files = {
    'inventory_request_list.html': '申请单',
    'inventory_request_detail.html': '申请单',
    'delivery_invoice_list.html': '出库单',
    'delivery_invoice_detail.html': '出库单',
    'inventory_transfer_list.html': '调拨单',
    'inventory_transfer_detail.html': '调拨单',
    'inventory_discrepancy_list.html': '差异处理',
    'inventory_discrepancy_detail.html': '差异处理',
    'inventory_sync_list.html': '同步日志',
    'inventory_sync_detail.html': '同步日志'
}

# The new submenu items
submenus = [
    ('inventory_request_list.html', '申请单'),
    ('delivery_invoice_list.html', '出库单'),
    ('inventory_transfer_list.html', '调拨单'),
    ('inventory_discrepancy_list.html', '差异处理'),
    ('inventory_sync_list.html', '同步日志')
]

# Regex pattern to find the 库存管理 menu-group
# We search for the block starting with <!-- 库存管理 --> until the end of that menu-group div
pattern = re.compile(r'<!-- 库存管理 -->\s*<div class="menu-group">.*?</div>\s*</div>', re.DOTALL)

def generate_new_block(current_file):
    is_active_group = current_file in inventory_files
    active_submenu_name = inventory_files.get(current_file)
    
    # Group Button
    if is_active_group:
        btn_class = "menu-toggle w-full flex items-center justify-between px-6 py-3 text-primary bg-blue-50/50 font-bold transition-all border-r-4 border-primary group"
        arrow_style = ' style="transform: rotate(180deg);"'
        content_class = "menu-content py-1 bg-slate-50/50"
    else:
        btn_class = "menu-toggle w-full flex items-center justify-between px-6 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group"
        arrow_style = ""
        content_class = "menu-content hidden py-1"

    new_block = f'''          <!-- 库存管理 -->
          <div class="menu-group">
            <button class="{btn_class}" onclick="toggleMenu(this)">
              <div class="flex items-center">
                <i class="fi fi-rr-boxes w-[16px] h-[16px] mr-3 flex items-center justify-center"></i>
                <span class="text-[13px]">库存管理</span>
              </div>
              <i class="fi fi-rr-angle-small-down w-[12px] h-[12px] text-slate-500 transition-transform duration-200 flex items-center justify-center"{arrow_style}></i>
            </button>
            <div class="{content_class}">'''
    
    for link, name in submenus:
        if name == active_submenu_name:
            link_class = "block pl-14 py-2 text-[13px] text-primary font-bold transition-colors relative after:content-[''] after:absolute after:left-[-12px] after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
        else:
            link_class = "block pl-14 py-2 text-[13px] text-slate-500 hover:text-primary transition-colors"
        
        new_block += f'\n              <a class="{link_class}" href="./{link}">{name}</a>'
    
    new_block += '\n            </div>\n          </div>'
    return new_block

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to find the block
    if pattern.search(content):
        new_block = generate_new_block(filename)
        new_content = pattern.sub(new_block, content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
    else:
        print(f"Could not find 库存管理 block in {filename}")

print("Done.")
