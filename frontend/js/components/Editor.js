export class Editor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.textarea = document.createElement('textarea');
        this.textarea.className = 'code-area';
        this.textarea.placeholder = '// Write your code here...';
        this.container.appendChild(this.textarea);
    }

    getCode() {
        return this.textarea.value;
    }

    setCode(code) {
        this.textarea.value = code;
    }
}
