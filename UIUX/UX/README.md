浏览UX html文件的两个方案：

### 方案一：用 Python 启动本地服务（通用，无需插件）
适合：任何静态网页 (`.html`, `.css`, `.js`)。

1.  **打开终端** (命令行)，进入你的文件夹：
    ```bash
    cd 你的文件夹路径
    ```
2.  **输入一行命令**：
    ```bash
    python -m http.server
    ```
3.  **浏览器访问**：
    `http://localhost:8000`

4. 如果 8000 被占用了，可以指定其他端口（例如 8080）：
    ```bash
    python -m http.server 8080
    ```


### 方案二：用 Chrome + Axure 插件（专为原型设计）
适合：专门浏览 **Axure RP** 生成的原型文件 (`index.html` + `data` 文件夹)。

1.  **安装插件**：
    *   打开 Chrome 浏览器，访问 **Chrome 应用商店**。
    *   搜索并安装：**"Axure RP Extension for Chrome"**。
2.  **启用本地访问权限** (关键步骤)：
    *   安装后，在地址栏输入 `chrome://extensions/` 并回车。
    *   找到刚安装的 Axure 插件，点击 **“详情”**。
    *   找到 **“允许访问文件网址”** (Allow access to file URLs)，将其开关 **打开**。
3.  **直接浏览**：
    *   直接在文件夹中双击你的 `index.html` 文件即可正常预览，无需启动 Python 服务。