// script.js (Complete Final Version for Deployment)

document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminal-output');
    const commandInput = document.getElementById('command-input');
    const inputLine = document.getElementById('input-line');
    const terminalContainer = document.getElementById('terminal-container');
    const { jsPDF } = window.jspdf;

    const TYPE_DELAY = 15;
    let commandHistory = [];
    let historyIndex = -1;
    let aliases = {};

    const bootSequence = [
        "INITIATING HANDSHAKE WITH BROADCAST DEPTH...",
        "ENCRYPTION LAYER SECURED.",
        "CONNECTING TO ZION MAIN FRAME... OK.",
        "OPERATOR CONSOLE v5.1 [OPTIMIZED]",
        " ",
        "Welcome back, Neo.",
        "Type 'help' for a list of available programs.",
        "Awaiting command..."
    ];

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const scrollToBottom = () => terminalContainer.scrollTop = terminalContainer.scrollHeight;

    async function typeLine(line, styleClass = 'system-message') {
        const lineElem = document.createElement('div');
        lineElem.className = `output-line ${styleClass}`;
        lineElem.innerHTML = line.replace(/ /g, ' '); 
        terminalOutput.appendChild(lineElem);
        scrollToBottom();
    }
    
    function showContent(content, styleClass, isCode = false) {
        const container = document.createElement('div');
        if (isCode) {
            container.innerHTML = `<pre class="code-block"><code></code></pre>`;
            container.querySelector('code').textContent = content;
        } else {
            container.className = `output-line ${styleClass}`;
            container.textContent = content;
        }
        terminalOutput.appendChild(container);
        createActionButtons(content);
        scrollToBottom();
    }

    function createActionButtons(contentToProcess) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-buttons';
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '[Copy]';
        copyBtn.className = 'action-btn';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(contentToProcess);
            copyBtn.textContent = '[Copied!]';
            setTimeout(() => { copyBtn.textContent = '[Copy]'; }, 2000);
        };
        const pdfBtn = document.createElement('button');
        pdfBtn.textContent = '[Download PDF]';
        pdfBtn.className = 'action-btn';
        pdfBtn.onclick = () => {
            const doc = new jsPDF();
            doc.setFont('Courier', 'normal');
            doc.setFontSize(10);
            doc.text(contentToProcess, 10, 10, { maxWidth: 190 });
            doc.save('operator_export.pdf');
        };
        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(pdfBtn);
        terminalOutput.appendChild(actionsDiv);
    }
    
    async function handleHashing(algo, text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await window.crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        showContent(hashHex, 'response-message');
    }

    async function processCommand(fullCommand) {
        commandHistory.push(fullCommand);
        historyIndex = commandHistory.length;

        const userLine = document.createElement('div');
        userLine.innerHTML = `<span class="prompt">></span> <span class="user-command">${fullCommand}</span>`;
        terminalOutput.appendChild(userLine);
        
        let [command, ...args] = fullCommand.trim().split('(');
        command = command.toLowerCase();

        if (aliases[command]) {
            await typeLine(`> ALIAS DETECTED: Running '${aliases[command]}' for '${command}'`, 'info-message');
            fullCommand = aliases[command] + '(' + fullCommand.substring(fullCommand.indexOf('(') + 1);
            [command, ...args] = fullCommand.trim().split('(');
        }
        
        const rawArgs = fullCommand.substring(fullCommand.indexOf('(') + 1, fullCommand.lastIndexOf(')'));

        // #######################################################
        // ### ALL FETCH URLS ARE NOW RELATIVE (e.g. /api/ask) ###
        // #######################################################
        switch (command) {
            case 'help': {
                const commands = [
                    { cmd: 'help', desc: 'Displays this list of programs' },
                    { cmd: 'ask("question")', desc: 'Ask a question to the Oracle' },
                    { cmd: 'clear', desc: 'Clears the console screen' },
                    { cmd: 'whoami', desc: 'Reveals your current designation' },
                    { cmd: 'wake_up', desc: 'Sends a message into the Matrix' },
                    { cmd: 'set_theme(theme)', desc: 'Changes color scheme (amber, sentinel_blue)' },
                    { cmd: 'alias(new, old)', desc: 'Creates a command shortcut' },
                    { cmd: 'generate_key(..)', desc: 'Creates a secure password (e.g. length:24)' },
                    { cmd: 'process_data(..)', desc: 'Hashes or encodes text (e.g. encode:base64)' },
                    { cmd: 'find_exit(URL)', desc: 'Summarizes a web page' },
                    { cmd: 'generate_code(..)', desc: 'Writes a code snippet (e.g. lang:"py",..)' },
                    { cmd: 'fabricate_data(..)', desc: 'Generates mock data (e.g. count:3, schema:{})' }
                ];

                await typeLine('Available Programs:', 'response-message');
                for (const item of commands) {
                    const line = `  ${item.cmd.padEnd(22)} - ${item.desc}`;
                    await typeLine(line, 'response-message help-menu');
                }
                break;
            }
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'whoami':
                await typeLine('> You are The One, Neo.', 'response-message');
                break;
            case 'wake_up':
                await typeLine('> Wake up, Neo... The Matrix has you...', 'info-message');
                break;
            case 'set_theme':
                document.body.dataset.theme = rawArgs || '';
                await typeLine(`> Theme set to: ${rawArgs || 'matrix_green'}`);
                break;
            case 'alias':
                const [aliasName, originalCmd] = rawArgs.split(',').map(s => s.trim());
                if (!aliasName || !originalCmd) {
                    await typeLine('> USAGE: alias(shortcut, original_command)', 'error-message');
                } else {
                    aliases[aliasName] = originalCmd;
                    await typeLine(`> Alias created: '${aliasName}' now runs '${originalCmd}'`);
                }
                break;
            case 'generate_key':
                const length = parseInt(rawArgs.match(/length:(\d+)/)?.[1] || '16');
                const useSymbols = rawArgs.includes('symbols:true');
                const useNumbers = rawArgs.includes('numbers:true');
                let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                if (useNumbers) chars += '0123456789';
                if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
                let key = '';
                for (let i = 0; i < length; i++) {
                    key += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                showContent(key, 'response-message');
                break;

            case 'process_data':
                const modeMatch = rawArgs.match(/(\w+:\w+)/)?.[1];
                const textMatch = rawArgs.match(/text:(.*)/)?.[1].trim();
                if(!modeMatch || !textMatch){
                     await typeLine('> USAGE: process_data(mode:type, text:yourtext)', 'error-message');
                     break;
                }
                const [mode, type] = modeMatch.split(':');
                if (mode === 'hash' && type === 'sha256') { await handleHashing('SHA-256', textMatch); }
                else if (mode === 'encode' && type === 'base64') { showContent(btoa(textMatch), 'response-message'); }
                else if (mode === 'decode' && type === 'base64') { showContent(atob(textMatch), 'response-message'); }
                else { await typeLine('> ERROR: Unsupported process.', 'error-message'); }
                break;

            case 'ask':
                await typeLine('Contacting the Oracle...', 'info-message');
                try {
                    const question = rawArgs.replace(/^"|"$/g, '');
                    if (!question) throw new Error("You must ask a question.");
                    const response = await fetch('/api/ask', { // CORRECTED URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: question }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    await typeLine(data.answer, 'response-message');
                } catch (err) { await typeLine(`> ORACLE ERROR: ${err.message}`, 'error-message'); }
                break;

            case 'find_exit':
                await typeLine('Signal confirmed. Tracing the exit path...', 'info-message');
                try {
                    if(!rawArgs) throw new Error("URL must be provided.");
                    const response = await fetch('/api/find_exit', { // CORRECTED URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: rawArgs }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    await typeLine(data.summary, 'response-message');
                } catch (err) { await typeLine(`> ERROR: ${err.message}`, 'error-message'); }
                break;

            case 'generate_code':
                 await typeLine('Accessing the Architect\'s toolbox...', 'info-message');
                 try {
                    const langMatch = rawArgs.match(/lang:\s*"([^"]+)"/);
                    const taskMatch = rawArgs.match(/task:\s*"([^"]+)"/);
                    if (!langMatch || !taskMatch) throw new Error('Invalid syntax.');
                    const language = langMatch[1];
                    const task = taskMatch[1];
                    const response = await fetch('/api/generate_code', { // CORRECTED URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ language, task }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    showContent(data.code, 'response-message', true);
                } catch (err) { await typeLine(`> ERROR: ${err.message}`, 'error-message'); }
                break;
            
            case 'fabricate_data':
                await typeLine('Accessing data fabrication subroutines...', 'info-message');
                try {
                    const format = rawArgs.match(/format:(\w+)/)?.[1];
                    const count = rawArgs.match(/count:(\d+)/)?.[1];
                    const schemaStr = rawArgs.match(/schema:({.*})/)?.[1];
                    const schema = JSON.parse(schemaStr.replace(/'/g, '"'));
                    const response = await fetch('/api/fabricate_data', { // CORRECTED URL
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ format, count, schema }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    showContent(data.data, 'response-message', true);
                } catch (err) { await typeLine(`> FABRICATION ERROR: ${err.message}`, 'error-message'); }
                break;

            default:
                await typeLine(`'${command}' is not a valid program, Neo.`, 'error-message');
        }
    }

    commandInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && commandInput.value.trim()) {
            e.preventDefault();
            const fullCommand = commandInput.value.trim();
            commandInput.value = '';
            inputLine.classList.add('hidden');
            await processCommand(fullCommand);
            inputLine.classList.remove('hidden');
            commandInput.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                commandInput.value = '';
            }
        }
    });

    terminalContainer.addEventListener('click', () => commandInput.focus());

    async function initialize() {
        commandInput.disabled = true;
        inputLine.classList.add('hidden');
        for (const line of bootSequence) {
            const lineElem = document.createElement('div');
            lineElem.className = `output-line system-message`;
            terminalOutput.appendChild(lineElem);
            for (let i = 0; i < line.length; i++) {
                lineElem.innerHTML += line.charAt(i);
                await sleep(TYPE_DELAY);
                scrollToBottom();
            }
        }
        commandInput.disabled = false;
        inputLine.classList.remove('hidden');
        commandInput.focus();
    }

    initialize();
});