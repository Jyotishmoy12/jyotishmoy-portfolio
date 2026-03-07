document.addEventListener("DOMContentLoaded", function () {
    const terminal = document.getElementById("terminal-output");
    const input = document.getElementById("terminal-input");
    const container = document.getElementById("terminal-container");
    const closeBtn = document.getElementById("terminal-close");
    const reopenBtn = document.getElementById("terminal-reopen");

    if (!terminal || !input || !container) return;

    // Toggle Functionality
    if (closeBtn && reopenBtn) {
        closeBtn.addEventListener("click", function () {
            container.style.display = "none";
            reopenBtn.style.display = "inline-block";
        });

        reopenBtn.addEventListener("click", function () {
            container.style.display = "block";
            reopenBtn.style.display = "none";
            input.focus();
        });
    }

    const fileMap = {
        "resume.md": "experience/",
        "technical-stack.md": "skills/",
        "overview.md": "projects/",
        "javascript/": "javascript-projects/",
        "go/": "go-projects/",
        "leetcode-backend.md": "leetcode-backend/",
        "airbnb-booking-system.md": "airbnb-clone/",
        "airline-booking-system.md": "airline-booking/",
        "go-torrent.md": "go-torrent/",
        "go-lsm.md": "go-lsm/",
        "go-smtp.md": "go-smtp/",
        "go-dns.md": "go-dns/",
        "all-posts.md": "blogs/",
        "http-message-structure.md": "http-structure/",
        "cdn-deep-dive.md": "cdn-deep-dive/",
        "cookies-deep-dive.md": "cookies-deep-dive/",
        "oauth-deep-dive.md": "oauth-deep-dive/",
        "inside-the-torrent-file.md": "torrent-file-structure/",
        "research-overview.md": "research/",
        "constrained-lcs-paper.md": "constrained-lcs-paper/",
        "lcs-paper.md": "lcs-paper/"
    };

    const commands = {
        help: "Available commands: ls, about, experience, skills, projects, blogs, research, contact, clear, help",
        about: "I am Jyotishmoy Deka, a Full Stack Engineer specialized in building scalable, high-performance systems. I bridge complex requirements with technical excellence.",
        ls: "Directories:\n<a href='experience/' class='terminal-link'>./experience/</a>\n<a href='skills/' class='terminal-link'>./skills/</a>\n<a href='projects/' class='terminal-link'>./projects/</a>\n<a href='blogs/' class='terminal-link'>./blogs/</a>\n<a href='research/' class='terminal-link'>./research/</a>",
        experience: "Path: /home/jyotishmoy/experience/\n- <a href='experience/' class='terminal-link'>./resume.md</a>",
        skills: "Path: /home/jyotishmoy/skills/\n- <a href='skills/' class='terminal-link'>./technical-stack.md</a>",
        projects: "Path: /home/jyotishmoy/projects/\n- <a href='projects/' class='terminal-link'>./projects-overview.md</a>\n- <a href='javascript-projects/' class='terminal-link'>./javascript/</a>\n- <a href='go-projects/' class='terminal-link'>./go/</a>",
        javascript: "Path: /home/jyotishmoy/projects/javascript/\n- <a href='javascript-projects/' class='terminal-link'>./overview.md</a>\n- <a href='leetcode-backend/' class='terminal-link'>./leetcode-backend.md</a>\n- <a href='airbnb-clone/' class='terminal-link'>./airbnb-booking-system.md</a>\n- <a href='airline-booking/' class='terminal-link'>./airline-booking-system.md</a>",
        go: "Path: /home/jyotishmoy/projects/go/\n- <a href='go-projects/' class='terminal-link'>./overview.md</a>\n- <a href='go-torrent/' class='terminal-link'>./go-torrent.md</a>\n- <a href='go-lsm/' class='terminal-link'>./go-lsm.md</a>\n- <a href='go-smtp/' class='terminal-link'>./go-smtp.md</a>\n- <a href='go-dns/' class='terminal-link'>./go-dns.md</a>",
        blogs: "Path: /home/jyotishmoy/blogs/\n- <a href='blogs/' class='terminal-link'>./all-posts.md</a>\n- <a href='http-structure/' class='terminal-link'>./http-message-structure.md</a>\n- <a href='cdn-deep-dive/' class='terminal-link'>./cdn-deep-dive.md</a>\n- <a href='cookies-deep-dive/' class='terminal-link'>./cookies-deep-dive.md</a>\n- <a href='oauth-deep-dive/' class='terminal-link'>./oauth-2.0-deep-dive.md</a>\n- <a href='torrent-file-structure/' class='terminal-link'>./inside-the-torrent-file.md</a>",
        research: "Path: /home/jyotishmoy/research/\n- <a href='research/' class='terminal-link'>./research-overview.md</a>\n- <a href='constrained-lcs-paper/' class='terminal-link'>./constrained-lcs-paper.md</a>\n- <a href='lcs-paper/' class='terminal-link'>./lcs-paper.md</a>",
        contact: "Email: <a href='mailto:jyotishmoydeka62@gmail.com' class='terminal-link'>jyotishmoydeka62@gmail.com</a>\nLinkedIn: <a href='https://linkedin.com/in/jyotishmoy-deka-6871b9229/' target='_blank' class='terminal-link'>/external/linkedin</a>\nGitHub: <a href='https://github.com/Jyotishmoy12' target='_blank' class='terminal-link'>/external/github</a>",
        clear: () => {
            terminal.innerHTML = "";
            return "";
        }
    };

    function typeWriter(text, i, targetElement, currentBuffer = "", fn) {
        if (i < text.length) {
            let char = text.charAt(i);

            if (char === '<') {
                const tagEnd = text.indexOf('>', i);
                if (tagEnd !== -1) {
                    currentBuffer += text.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    currentBuffer += char;
                    i++;
                }
            } else if (char === '\n') {
                currentBuffer += "<br>";
                i++;
            } else {
                currentBuffer += char;
                i++;
            }

            targetElement.innerHTML = currentBuffer;
            setTimeout(() => typeWriter(text, i, targetElement, currentBuffer, fn), 5);
        } else if (fn) {
            fn();
        }
        container.scrollTop = container.scrollHeight;
    }

    function processCommand(cmd) {
        const line = document.createElement("div");
        line.className = "terminal-line";
        line.innerHTML = `<span class="prompt">jyotishmoy@portfolio:~$</span> <span class="command">${cmd}</span>`;
        terminal.appendChild(line);

        const responseWrapper = document.createElement("div");
        responseWrapper.className = "terminal-response";
        terminal.appendChild(responseWrapper);

        const lowerCmd = cmd.toLowerCase().trim();

        // Handle file aliases or directories
        const cleanCmd = lowerCmd.startsWith("./") ? lowerCmd.substring(2) : lowerCmd;

        if (commands[lowerCmd]) {
            if (typeof commands[lowerCmd] === "function") {
                commands[lowerCmd]();
            } else {
                typeWriter(commands[lowerCmd], 0, responseWrapper);
            }
        } else if (fileMap[cleanCmd]) {
            const msg = `Redirecting to ${cleanCmd}...`;
            typeWriter(msg, 0, responseWrapper, "", () => {
                window.location.href = fileMap[cleanCmd];
            });
        } else if (lowerCmd !== "") {
            const errorLine = document.createElement("div");
            errorLine.innerHTML = `Command not found: ${cmd}. Type 'help' for assistance.`;
            responseWrapper.appendChild(errorLine);
        }

        container.scrollTop = container.scrollHeight;
    }

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const cmd = input.value;
            processCommand(cmd);
            input.value = "";
        }
    });

    // Initial welcome message
    const welcome = "Welcome to Jyotishmoy's Interactive Portfolio. Type 'help' to begin.";
    const welcomeWrapper = document.createElement("div");
    welcomeWrapper.className = "terminal-response";
    terminal.appendChild(welcomeWrapper);
    typeWriter(welcome, 0, welcomeWrapper);
});
