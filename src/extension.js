const vscode = require('vscode');
const { exec } = require('child_process');
const { python, PythonException } = require('./python.js');
const EXTENSION_ID = 'lcy.micropython-micobit-support';
function extensionUri()
{
	return vscode.extensions.getExtension(EXTENSION_ID).extensionUri;
}
function toolsPath()
{
	return vscode.Uri.joinPath(extensionUri(), 'tools');
}
async function uflash(params = '')
{
	const tools = toolsPath();
	const uflashDir = vscode.Uri.joinPath(tools, 'uflash-master');
	const uflash = vscode.Uri.joinPath(uflashDir, 'uflash.py');
	const { stdout, stderr } = await python.run(
		`"${uflash.fsPath}" ${params}`,
		uflashDir.fsPath
	);
	return { stdout, stderr };
}
module.exports = {
	uflash,
	extensionUri,
	toolsPath,
};