const isVimModeEnabled = localStorage.getItem('vimMode') === '1';
const vimModeCheckbox = document.getElementById('vimMode');
vimModeCheckbox.checked = isVimModeEnabled;

const defaultText = '- успех;\n- восторг;\n- я стану более лучше одеваться.';

const editors = [];
const options = {
    mode: 'markdown',
    lineNumbers: true,
    theme: 'default',
    indentWithTabs: false,
    lineNumbers: false,
    extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList',
        'Ctrl-S': save,
        'Tab': focusNextEditor,
        'Cmd-S': save
    }
};

function focusNextEditor(cm) {
    const currentIndex = editors.indexOf(cm);
    const nextIndex = (currentIndex !== 3) ? currentIndex + 1 : 0;
    editors[nextIndex].focus();
}

function save(cm) {
    const el = cm.display.wrapper;
    el.classList.add('saving');
    setTimeout(() => {
        el.classList.remove('saving')
    }, 500);
}

if (isVimModeEnabled) {
    options.keyMap = 'vim';
}

document.querySelectorAll('.square__text').forEach((el, index) => {
    options.autofocus = index === 0;
    const editor = CodeMirror.fromTextArea(el, options);

    const savedText = localStorage.getItem(el.name) || '';
    editor.getDoc().setValue(savedText);

    if (index === 0 && savedText == '') {
        editor.getDoc().setValue(defaultText);
    }

    editor.on('change', function(cm, co) {
        const text = cm.getValue();
        const el = cm.getTextArea();
        localStorage.setItem(el.name, text);
    });

    editors.push(editor);
});

vimModeCheckbox.addEventListener('change', toggleVimMode);

function toggleVimMode() {
    localStorage.setItem('vimMode', +this.checked);
    location.reload();
}