# Heroicons Outline 图标迁移指南

## 📦 图标库变更

### 从 Bootstrap Icons 迁移到 Heroicons Outline

**时间**: 2026 年 3 月 27 日  
**版本**: Heroicons v2.1.3 (Outline 风格)

## 🔧 技术实现

### 引入方式
```html
<!-- 不再使用 CDN 链接 -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"> -->

<!-- 使用 SVG 内联方式 -->
<svg class="heroicon w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="..." />
</svg>
```

### CSS 样式
```css
.heroicon {
    vertical-align: middle;
    width: 1.25em;
    height: 1.25em;
}
```

## 🎯 图标映射对照表

### 导航和菜单图标

| 用途 | Bootstrap Icons | Heroicons Outline | SVG 路径关键词 |
|------|----------------|-------------------|---------------|
| 仪表盘 | `bi-speedometer2` | speedometer | 速度计网格 |
| 用户 | `bi-people` | users | 多人轮廓 |
| 产品 | `bi-box-seam` | cube | 立方体盒子 |
| 工单 | `bi-ticket-perforated` | ticket | 票据形状 |
| 设置 | `bi-gear` | cog | 齿轮 |
| 折叠菜单 | `bi-chevron-double-left` | chevron-double-left | 双左箭头 |
| 展开更多 | `bi-chevron-down` | chevron-down | 下箭头 |

### 操作图标

| 用途 | Bootstrap Icons | Heroicons Outline | SVG 路径关键词 |
|------|----------------|-------------------|---------------|
| 日历 | `bi-calendar` | calendar | 日历网格 |
| 添加 | `bi-plus-lg` | plus | 加号 |
| 搜索 | `bi-search` | magnifying-glass | 放大镜 |
| 打印 | `bi-printer` | printer | 打印机 |
| 保存 | `bi-save` | arrow-down-tray | 下载托盘 |
| 复制 | `bi-clipboard` | clipboard | 剪贴板 |
| 退出 | `bi-box-arrow-right` | arrow-right-on-rectangle | 右箭头出框 |

### 状态图标

| 用途 | Bootstrap Icons | Heroicons Outline | SVG 路径关键词 |
|------|----------------|-------------------|---------------|
| 时钟历史 | `bi-clock-history` | clock | 时钟表盘 |
| 警告三角 | `bi-exclamation-triangle` | exclamation-triangle | 三角感叹号 |
| 地球仪 | `bi-globe` | globe-alt | 地球世界地图 |
| 用户个人 | `bi-person` | user | 单人轮廓 |
| 锁 | `bi-lock` | lock-closed | 闭合锁 |
| 眼睛 | `bi-eye` | eye | 眼睛 |

### 导航图标

| 用途 | Bootstrap Icons | Heroicons Outline | SVG 路径关键词 |
|------|----------------|-------------------|---------------|
| 条形码 | `bi-upc-scan` | qr-code | 二维码方格 |
| 左箭头 | `bi-chevron-left` | chevron-left | 左 V 形 |
| 右箭头 | `bi-chevron-right` | chevron-right | 右 V 形 |
| 前进箭头 | `bi-arrow-right` | arrow-right | 直右箭头 |
| 三点更多 | `bi-three-dots-vertical` | ellipsis-vertical | 垂直三点 |

## 💡 使用示例

### 侧边栏菜单图标
```html
<!-- Dashboard -->
<a href="./dashboard.html">
    <svg class="heroicon w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
    </svg>
    <span>Dashboard</span>
</a>
```

### 按钮图标
```html
<!-- 添加按钮 -->
<button>
    <svg class="heroicon w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
    </svg>
    New Ticket
</button>
```

### 表单图标
```html
<!-- 搜索框 -->
<div class="relative">
    <svg class="heroicon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.607 10.607Z"/>
    </svg>
    <input type="text" placeholder="Search..."/>
</div>
```

## 🎨 尺寸规范

### 标准图标尺寸
```html
<!-- 小图标 (16px) -->
<svg class="heroicon w-4 h-4"></svg>

<!-- 标准图标 (20px) -->
<svg class="heroicon w-5 h-5"></svg>

<!-- 大图标 (24px) -->
<svg class="heroicon w-6 h-6"></svg>

<!-- 特大图标 (32px) -->
<svg class="heroicon w-8 h-8"></svg>
```

### 间距规范
```html
<!-- 图标右边距 -->
<svg class="heroicon w-5 h-5 mr-3"></svg> <!-- 12px -->
<svg class="heroicon w-5 h-5 mr-2"></svg> <!-- 8px -->
<svg class="heroicon w-5 h-5 mr-4"></svg> <!-- 16px -->
```

## ✅ 优势对比

### Heroicons Outline vs Bootstrap Icons

| 特性 | Heroicons Outline | Bootstrap Icons |
|------|------------------|-----------------|
| 风格 | 简洁线条 | 填充/轮廓可选 |
| 引入方式 | SVG 内联 | 字体文件 |
| 自定义性 | 完全可控 | 受限于字体 |
| 性能 | 按需加载 | 全量加载 |
| 兼容性 | 极佳 | 良好 |
| 文件大小 | 按使用量 | 固定大小 |

## 🔍 查找图标

### 官方资源
- **Heroicons 官网**: https://heroicons.com
- **GitHub**: https://github.com/tailwindlabs/heroicons
- **文档**: https://github.com/tailwindlabs/heroicons#vue

### 使用建议
1. 访问官网查看完整图标集
2. 选择 Outline 风格（24x24）
3. 复制 SVG 代码
4. 添加到 HTML 中
5. 调整 Tailwind 类名控制尺寸和颜色

## 📝 注意事项

1. **所有图标必须使用 SVG 内联方式**
2. **保持统一的 class 命名**: `heroicon w-5 h-5`
3. **使用 stroke-width="1.5"** 保持线条粗细一致
4. **viewBox 统一为 "0 0 24 24"**
5. **颜色通过 Tailwind 类控制**: `text-slate-400`, `text-primary` 等

## 🚀 迁移步骤

1. 确定要替换的 Bootstrap Icon
2. 在 Heroicons 官网找到对应图标
3. 复制 SVG 代码
4. 替换原有的 `<i>` 标签
5. 调整 class 名称和尺寸
6. 测试显示效果

---

**更新时间**: 2026-03-27  
**维护者**: UI Team
