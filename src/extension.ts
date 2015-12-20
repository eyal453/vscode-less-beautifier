// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {
window,
commands,
workspace,
WorkspaceEdit,
Disposable,
Range,
Position,
ExtensionContext,
StatusBarAlignment,
StatusBarItem,
TextDocument} from 'vscode';

var beautifier = require("js-beautify").css;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {


    let cssBeautifier = new CssBeautifier();

    var disposable = commands.registerCommand('extension.beautifyLess', () => {
        cssBeautifier.DoWork();
    });

    context.subscriptions.push(cssBeautifier);
    context.subscriptions.push(disposable);
}

class CssBeautifier {

    public DoWork() {

        let editor = window.activeTextEditor;
        let doc = editor.document;
        if (doc.languageId !== "less") return;
        editor.edit((eb) => {
            var text = doc.getText();
            var pretty = beautifier(text, {
                newlineBetweeRules: true,
                selectorSeparatorNewline:true,
                preserveNewlines:true
            });
            var p1 = new Position(0, 0);
            var p2 = new Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);

            var r = new Range(p1, p2);
            try {
                eb.replace(r, pretty);
            } catch (er) {
                console.error("Cannot parse LESS file.", er.message);
            }
        });
    }

    dispose() {
    }

}

// this method is called when your extension is deactivated
export function deactivate() {
}