import { createSnippet, getSnippets, deleteSnippet, duplicateSnippet, toggleFavorite } from './api/client.js';

let currentLang = 'html';
let files = {
    html: '<!-- Write HTML here -->\n<h1>Hello World</h1>\n<style>\n  /* CSS can go here */\n  body { font-family: sans-serif; }\n</style>\n<script>\n  // JS can go here\n  console.log("Running Code...");\n</script>',
    css: '/* Write CSS here */\nbody {\n  background: #f0f0f0;\n  color: #333;\n  text-align: center;\n  padding-top: 50px;\n}',
    javascript: '// Write JavaScript here\ndocument.querySelector("h1").innerText += "!";'
};

window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/'
    };
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

// Load standard Monaco files
require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: files[currentLang],
        language: currentLang,
        theme: 'vs-dark',
        automaticLayout: true,
        wordWrap: 'on',
        minimap: { enabled: false }
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        monaco.editor.setTheme(isDark ? 'vs-light' : 'vs-dark');
    });

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Save current code
            files[currentLang] = editor.getValue();
            
            // Switch lang
            currentLang = e.currentTarget.dataset.lang;
            monaco.editor.setModelLanguage(editor.getModel(), currentLang);
            editor.setValue(files[currentLang] || '');
        });
    });

    // Run code
    const runBtn = document.getElementById('run-btn');
    const iframe = document.getElementById('preview-frame');
    runBtn.addEventListener('click', () => {
        files[currentLang] = editor.getValue(); // Get the latest value from the active tab.

        const html = files.html;
        const css = `<style>${files.css}</style>`;
        const js = `<script>${files.javascript}<\/script>`;

        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                ${css}
            </head>
            <body>
                ${html}
                ${js}
            </body>
            </html>
        `;

        iframe.srcdoc = fullHTML;
    });

    // Reset code
    document.getElementById('reset-btn').addEventListener('click', () => {
        if(confirm('Are you sure you want to reset all code?')) {
            files = { html: '', css: '', javascript: '' };
            editor.setValue('');
            iframe.srcdoc = '';
        }
    });

    // Download code
    document.getElementById('download-btn').addEventListener('click', () => {
        files[currentLang] = editor.getValue();
        const zipContent = `
            <!-- index.html -->
            ${files.html}
            \n<!-- style.css -->\n
            <style>\n${files.css}\n</style>
            \n<!-- script.js -->\n
            <script>\n${files.javascript}\n</script>
        `;
        const blob = new Blob([zipContent], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'project.html';
        a.click();
    });

    // Resizer logic
    const resizer = document.getElementById('dragMe');
    const leftPanel = document.querySelector('.left-panel');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        let newWidth = e.clientX;
        // Limit
        if (newWidth < 100) newWidth = 100;
        if (newWidth > window.innerWidth - 100) newWidth = window.innerWidth - 100;
        
        leftPanel.style.flex = `0 0 ${newWidth}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
        }
    });

    // Initial run
    runBtn.click();

    // API Integrations mapped
    const saveDbBtn = document.getElementById('save-db-btn');
    if (saveDbBtn) {
        saveDbBtn.addEventListener('click', async () => {
            const title = prompt("Enter snippet title:", "My Snippet");
            if (!title) return;
            files[currentLang] = editor.getValue();
            try {
                const res = await createSnippet({
                    title,
                    htmlCode: files.html,
                    cssCode: files.css,
                    jsCode: files.javascript,
                    language: 'web'
                });
                if (res.success) {
                    alert('Saved Successfully!');
                } else {
                    alert('Error: ' + res.error);
                }
            } catch(e) {
                alert('Network Error');
            }
        });
    }

    const snippetsBtn = document.getElementById('snippets-btn');
    const modal = document.getElementById('snippets-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const snippetsList = document.getElementById('snippets-list');
    
    if (snippetsBtn && modal) {
        let fetchAndRender = async () => {
            snippetsList.innerHTML = 'Loading...';
            try {
                const search = document.getElementById('search-snippets').value;
                const language = document.getElementById('filter-language').value;
                const sort = document.getElementById('sort-snippets').value;

                const params = { search, language, sort };
                // remove empty params
                Object.keys(params).forEach(key => !params[key] && delete params[key]);

                const res = await getSnippets(params);
                if (res.success) {
                    snippetsList.innerHTML = '';
                    res.data.forEach(snippet => {
                        const li = document.createElement('li');
                        li.style.cssText = 'padding: 10px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;';
                        li.innerHTML = `
                            <div>
                                <strong>${snippet.title || 'Untitled'}</strong> 
                                <em>(${new Date(snippet.createdAt).toLocaleDateString()})</em>
                                <span style="color: gold; cursor:pointer;" class="fav-btn" data-id="${snippet._id}">
                                    ${snippet.isFavorite ? '★' : '☆'}
                                </span>
                            </div>
                            <div>
                                <button class="btn duplicate-btn" data-id="${snippet._id}">Duplicate</button>
                                <button class="btn btn-danger delete-btn" data-id="${snippet._id}">Delete</button>
                            </div>
                        `;
                        snippetsList.appendChild(li);
                    });
                }
            } catch(e) {
                snippetsList.innerHTML = 'Failed to load';
            }
        };

        snippetsBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            fetchAndRender();
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('search-snippets').addEventListener('input', fetchAndRender);
        document.getElementById('filter-language').addEventListener('change', fetchAndRender);
        document.getElementById('sort-snippets').addEventListener('change', fetchAndRender);

        snippetsList.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (e.target.classList.contains('delete-btn')) {
                if(confirm('Are you sure you want to delete this snippet?')) {
                    await deleteSnippet(id);
                    fetchAndRender();
                }
            } else if (e.target.classList.contains('duplicate-btn')) {
                await duplicateSnippet(id);
                fetchAndRender();
                alert('Duplicated successfully!');
            } else if (e.target.classList.contains('fav-btn')) {
                await toggleFavorite(id);
                fetchAndRender();
            }
        });
    }

    // AI Generator Modal Logic
    const aiBtn = document.getElementById('ai-btn');
    const aiModal = document.getElementById('ai-modal');
    const closeAiBtn = document.getElementById('close-ai-modal');
    const generateAiBtn = document.getElementById('generate-ai-btn');
    const aiPromptInput = document.getElementById('ai-prompt');
    const aiLoading = document.getElementById('ai-loading');

    if(aiBtn && aiModal) {
        aiBtn.addEventListener('click', () => {
            aiModal.style.display = 'block';
            aiPromptInput.focus();
        });

        closeAiBtn.addEventListener('click', () => {
            aiModal.style.display = 'none';
        });

        generateAiBtn.addEventListener('click', async () => {
            const prompt = aiPromptInput.value.trim();
            if(!prompt) return alert('Please enter a prompt first.');
            
            generateAiBtn.disabled = true;
            aiLoading.style.display = 'block';

            try {
                const { generateWithAI } = await import('./api/client.js');
                const response = await generateWithAI(prompt);
                
                if (response.success && response.data) {
                    files.html = response.data.html || '';
                    files.css = response.data.css || '';
                    files.javascript = response.data.javascript || '';
                    
                    editor.setValue(files[currentLang]);
                    aiModal.style.display = 'none';
                    runBtn.click(); // Automatically run the new code
                } else {
                    alert(response.error || 'AI generation failed');
                }
            } catch(e) {
                console.error(e);
                alert('Connection error or AI feature unavailable.');
            } finally {
                generateAiBtn.disabled = false;
                aiLoading.style.display = 'none';
            }
        });
    }

});
