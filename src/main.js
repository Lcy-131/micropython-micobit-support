const vscode = require('vscode');
const {
    uflash,
	extensionUri,
	toolsPath,
} = require('./extension.js');
function activate(context) {
    console.log('祝贺, 你的扩展 "vsmicrobit" 现在活动了!');
    let flash_to_microbit = vscode.commands.registerCommand('extension.buildmicrobit', function () {
        let doc = vscode.window.activeTextEditor.document;
        vscode.window.showInformationMessage('向Micro:bit刷入代码' + doc.uri.fsPath);
        console.log(doc.uri.fsPath);
        let ter = vscode.window.createTerminal("Micro:bit刷写固件");
        ter.show();
        ter.sendText("uflash " + doc.uri.fsPath);
    });
    let flash_micropython = vscode.commands.registerCommand('extension.flash-micropython', async function () {
        try
        {
            await uflash();
            vscode.window.showInformationMessage("MicroPython 成功安装");
        }
        catch (e)
        {
            const date = `[${new Date()}]`;
            vscode.window.showErrorMessage(`${e}`);
            const output = vscode.window.createOutputChannel("micro:bit");
            output.appendLine(`错误: ${date}\n${e}\n`);
        }
      });
    let get_firmware = vscode.commands.registerCommand('extension.update_firmware', function () {
        vscode.window.showInformationMessage('正在下载固件V1');
        const d = new vscode.Task({type:"Download"}, vscode.TaskScope.Workspace, "Microbit firmware download", "Microbit firmware download",
        "cd " + toolsPath() + " && curl https://tech.microbit.org/docs/software/assets/DAPLink-factory-release/0249_kl26z_microbit_0x8000.hex -o ./firmware.hex",);
        vscode.tasks.onDidEndTaskProcess((async t => {t.execution === await vscode.tasks.executeTask(d); (0 === t.exitCode?(vscode.window.showInformationMessage("下载成功!"), uflash()) : vscode.window.showErrorMessage("Error compiling!"))}))
    });
    let show_pin_map = vscode.commands.registerCommand('extension.showPinMap', function () {
        const panel = vscode.window.createWebviewPanel(
            'pins',
            'micro:bit Pins',
            vscode.ViewColumn.Active, {
                // Only allow the webview to access resources in our extension's media directory
                localResourceRoots: [vscode.Uri.joinPath(extensionUri(), "images")]
            }
        );
        const onDiskPath = vscode.Uri.file(
            vscode.Uri.joinPath(extensionUri(), "images", "PinOutV2V1.png").fsPath
        );
        const imageUrl = panel.webview.asWebviewUri(onDiskPath);
        panel.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pico Pin Map</title>
            <style type="text/css">
                body {
                    background-color: var(--vscode-editor-background);
                }
            </style>
        </head>
        <body>
            <img src="${imageUrl}" />
        </body>
        </html>`;
    });
    context.subscriptions.push(flash_to_microbit);
    context.subscriptions.push(flash_micropython);
    context.subscriptions.push(get_firmware);
    context.subscriptions.push(show_pin_map);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate()
{
}
exports.deactivate = deactivate;