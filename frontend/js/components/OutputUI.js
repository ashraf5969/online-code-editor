export class OutputUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(output) {
        this.container.innerHTML = `<pre>${output}</pre>`;
    }
}
