// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codeline" is now active!');

	//读取 .vscode/settings.json 中的配置项
	readSettings() ;
	vscode.window.showInformationMessage('[CodeLine]您的 http 监听端口是 ' + gHttpPort + "可通过发送 get 请求来定位代码的位置。");

	startHttpServer(Number.parseInt(gHttpPort));

	//return;

	//--

	//一个简单的显示信息的命令
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('codeline.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from CodeLine!');
	});

	context.subscriptions.push(disposable);

	//--------------------------------------------------------
	//在右侧会显示一个大面板
	context.subscriptions.push(
        vscode.commands.registerCommand('codeline.showWebview', () => {
            const panel = vscode.window.createWebviewPanel(
                'CodeLine Webview',
                '插件名称 CodeLine',
                vscode.ViewColumn.One,
                {}
            );

            panel.webview.html = getWebviewContent();

			//test 打开一个文件，跳到指定行
			////openFileAndJumpToLine('F:/test1/vscode_edit1/vscode2/codeline/src/extension.ts', 36);

        })
    );


	//--------------------------------------------------------
	//显示一个信息提示窗口
	////vscode.window.showInformationMessage('Hello World from CodeLine!');



}//

// This method is called when your extension is deactivated
export function deactivate() {}


// --------------------------------------------------------
function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <body>
		CodeLine 是一个代码跳转插件，您可以通过发送 http 的 get 请求来让 vscode 跳转到指定的代码位置。<br>
		例如 htttp://127.0.0.1:8800/go?file_name=fn&line_no=100 <br>
		其中 8800 是您在项目 .vscode/settings.json 中的配置项，例如 "CodeLine.http_port":"8800"
	    <!--
        <button onclick="vscode.postMessage({command: 'alert', text: '按钮被点击了！'})">
            点击我
        </button>
        <script>
            const vscode = acquireVsCodeApi();
        </script>
		-->
    </body>
    </html>`;
}//

//--------------------------------------------------------


//打开一个文件，并跳到指定行
async function openFileAndJumpToLine(filePath: string, lineNumber: number) {

	// await vscode.window.showTextDocument(document, {
	// 	viewColumn: vscode.ViewColumn.Two, // 在第二列显示
	// 	preserveFocus: true, // 不改变当前焦点
	// 	preview: false // 在非预览模式下打开
	//   });

    // vscode.workspace.openTextDocument(filePath).then(doc => {
    //     vscode.window.showTextDocument(doc, {
    //         selection: new vscode.Position(lineNumber - 1, 0)
    //     });
    // });

    //const editor = await vscode.window.showTextDocument(vscode.Uri.file('/path/to/file.txt'));
	const editor = await vscode.window.showTextDocument(vscode.Uri.file(filePath));

	// 这会将焦点切换到包含该文件的编辑器
	// editor.edit(editBuilder => {
	// 	editBuilder.insert(new vscode.Position(0, 0), '新内容');


	// });

	// 创建一个表示目标行的范围
    const line = editor.document.lineAt(lineNumber - 1);
    const range = new vscode.Range(line.range.start, line.range.end);
    
    // 跳转到指定行并将其居中显示
    //editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
	//vscode.TextEditorRevealType.Default：默认行为，通常会将行滚动到视图中，但不一定居中。
	editor.revealRange(range, vscode.TextEditorRevealType.Default);
    
    // 将光标移动到该行
    editor.selection = new vscode.Selection(range.start, range.start);

}//


//--------------------------------------------------------
//========================================================
//下面是网络监听
import * as http from 'http';

function startHttpServer(PORT:Number) {
    const server = http.createServer((req, res) => {
        // 处理请求
        console.log(`收到请求: ${req.method} ${req.url}`);

		const url = new URL(req.url || '', `http://${req.headers.host}`);
        const name = url.searchParams.get('name'); // 获取查询参数 name
        const age = url.searchParams.get('age');   // 获取查询参数 age
      	//const file_name_base64 = url.searchParams.get('file_name_base64'); //文件名 base64 编码的
      	const file_name = url.searchParams.get('file_name'); //文件名
        const lineNumber = url.searchParams.get('line_no');   //行号

		//-- 跳到指定位置
		if (file_name && lineNumber){
			openFileAndJumpToLine(file_name, Number.parseInt(lineNumber));
		}//if


        // 设置响应头
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, this is CodeLine HTTP server!\n');
    });

    //const PORT = 3000; // 选择一个端口
    server.listen(PORT, () => {
        console.log(`HTTP 服务器正在监听 http://localhost:${PORT}`);
    });

    // 处理服务器错误
    server.on('error', (err) => {
        console.error('服务器错误:', err);
    });

}//

// 在扩展激活时调用这个函数
//startHttpServer();

let gHttpPort:string = "8800";

//读取 .vscode/settings.json 中的配置项
//要让 VS Code 识别您的扩展配置，您需要在扩展的 package.json 文件中正确地定义配置项。
// 在您的扩展的 package.json 文件中，您需要在 contributes 部分添加 configuration 字段。
function readSettings() {
    // 获取工作区的配置
    const config = vscode.workspace.getConfiguration('CodeLine'); //'yourExtensionName');

    // 读取特定的配置项
    const http_port = config.get<string>('http_port');
    //const anotherSetting = config.get<number>('anotherSettingKey');

	if (http_port){
		gHttpPort = http_port;
	}

    //console.log('Some Setting:', someSetting);
    //console.log('Another Setting:', anotherSetting);
}//




// --------------------------------------------------------
// 插件不能直接在这个项目中运行，要在 codeline 中，并且只能用 vscode 打开。现在还不能在 Cursor 中运行。

// 另外在 yo code 中选择的是 ts 项目，所以要先编译，命令为:
//  npm run compile

//--------------------------------------------------------
//https://marketplace.visualstudio.com/vscode  中似乎可以直接发布，并不需要你说的账号
//您可以直接使用 GitHub 账户在 Visual Studio Marketplace 上发布 VS Code 扩展，而不需要单独的 Azure DevOps 账户。

//使用 vsce 工具打包您的扩展，生成 .vsix 文件。
// npm install -g vsce
// vsce package
