var katescript = {
    "author":       "Clinton Reddekop",
    "license":      "BSD",
    "revision":     3,
    "kate-version": 5.68,
    "functions":    ["copyAppend", "cutAppend", "swapCutPaste"],
    "actions": [
        {   "function":     "copyAppend",
            "name":         "Copy and Append Selection to Clipboard",
            "category":     "Editing",
            "shortcut":     "Ctrl+Shift+c",
            "interactive":  "false"
        },
        {   "function":     "cutAppend",
            "name":         "Cut and Append Selection to Clipboard",
            "category":     "Editing",
            "shortcut":     "Ctrl+Shift+x",
            "interactive":  "false"
        },
        {   "function":     "swapCutPaste",
            "name":         "Swap Selection and Clipboard Contents",
            "category":     "Editing",
            "shortcut":     "Ctrl+Shift+v",
            "interactive":  "false"
        }
    ]
};

//  MIT License
//  
//  Copyright (c) 2021  Clinton J.S. Reddekop
//  
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//  
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//  
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.

// Reference: https://docs.kde.org/stable5/en/kate/katepart/dev-scripting.html

require("cursor.js");

function help(cmd)
{
    if (cmd == "copyAppend")
    {
        return i18n("Append a copy of the selected text to the contents of the clipboard.");
    }
    else if (cmd == "cutAppend")
    {
        return i18n("Cut the selected text and append it to the contents of the clipboard.");
    }
    else if (cmd == "swapCutPaste")
    {
        return i18n("Swap the current selection with the contents of the clipboard.");
    }
}

function worker(cut, swap)
{
    var selStr = "";
    if (view.hasSelection())
    {
        // Get the selection
        selStr = view.selectedText();
        if (cut)
        {
            view.removeSelectedText();
        }
    }
    else
    {
        // Nothing is selected, so get the current line
        curLineStartPos = new Cursor(view.cursorPosition().line, 0)
        if (!curLineStartPos.isValid())
        {
            return;
        }
        // document.line() doesn't copy the line-end so append "\n":
        selStr = document.line(curLineStartPos.line) + "\n";
        
        if (cut)
        {
            document.removeLine(curLineStartPos.line);
        }
    }
    
    var clipStr = editor.clipboardText();
    if (swap) // swapCutPaste
    {
        editor.setClipboardText(selStr);
        document.insertText(view.cursorPosition(), clipStr);
    }
    else // cutAppend or copyAppend --- do the "append" now
    {
        var newClipStr = clipStr + selStr;
        editor.setClipboardText(newClipStr);
    }
}

function copyAppend()
{
    worker(false, false);
}

function cutAppend()
{
    worker(true, false);
}

function swapCutPaste()
{
    worker(true, true);
}
