# CodeLine

这是一个代码跳转插件，您可以通过发送 http 的 get 请求来让 vscode 跳转到指定的代码位置。<br>
		例如 htttp://127.0.0.1:8800/go?file_name=fn&line_no=100 <br>
		

## 安装

1. 打开 VS Code。
2. 转到扩展视图（侧边栏中的方块图标）。
3. 搜索 "CodeLine" 并点击安装。

## 用法

安装后，您可以通过命令面板（`Ctrl + Shift + P`）使用该扩展。

您可以通过发送 http 的 get 请求来让 vscode 跳转到指定的代码位置。

例如 htttp://127.0.0.1:8800/go?file_name=fn&line_no=100

其中 8800 是您在项目 .vscode/settings.json 中的配置项，例如 "CodeLine.http_port":"8800"。

## 配置

您可以在设置中配置扩展的选项。
在项目 .vscode/settings.json 中的配置项，例如 "CodeLine.http_port":"8800"。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

本项目采用 MIT 许可证。
