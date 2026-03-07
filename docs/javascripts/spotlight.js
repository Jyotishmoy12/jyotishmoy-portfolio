document.addEventListener("DOMContentLoaded", function () {
    const searchData = [
        // Projects
        { title: "LeetCode Backend System", category: "Javascript Project", url: "../leetcode-backend/" },
        { title: "Airbnb Booking System", category: "Javascript Project", url: "../airbnb-clone/" },
        { title: "Airline Booking System", category: "Javascript Project", url: "../airline-booking/" },
        { title: "Go-Torrent", category: "Go Project", url: "../go-torrent/" },
        { title: "Go-LSM", category: "Go Project", url: "../go-lsm/" },
        { title: "Go-SMTP Server", category: "Go Project", url: "../go-smtp/" },
        { title: "Go-DNS Server", category: "Go Project", url: "../go-dns/" },
        // Blog Posts
        { title: "HTTP Message Structure", category: "Blog", url: "../http-structure/" },
        { title: "CDN Deep Dive", category: "Blog", url: "../cdn-deep-dive/" },
        { title: "Cookies Deep Dive", category: "Blog", url: "../cookies-deep-dive/" },
        { title: "OAuth 2.0 Deep Dive", category: "Blog", url: "../oauth-deep-dive/" },
        { title: "Inside the Torrent File", category: "Blog", url: "../torrent-file-structure/" },
        // Research
        { title: "LCS & LCStr Algo", category: "Research", url: "../lcs-paper/" },
        { title: "Constrained LCS", category: "Research", url: "../constrained-lcs-paper/" }
    ];

    // Create Modal HTML
    const modalHTML = `
        <div id="spotlight-overlay">
            <div id="spotlight-modal">
                <div class="spotlight-search-container">
                    <input type="text" id="spotlight-input" placeholder="Search projects, blogs, research..." autocomplete="off">
                    <span class="spotlight-hint">ESC to close</span>
                </div>
                <div id="spotlight-results"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById("spotlight-overlay");
    const input = document.getElementById("spotlight-input");
    const resultsContainer = document.getElementById("spotlight-results");
    let activeIndex = -1;
    let filteredData = [];

    function toggleSpotlight() {
        if (overlay.style.display === "flex") {
            overlay.style.display = "none";
            input.value = "";
            resultsContainer.innerHTML = "";
            activeIndex = -1;
        } else {
            overlay.style.display = "flex";
            input.focus();
            renderResults("");
        }
    }

    function renderResults(query) {
        resultsContainer.innerHTML = "";
        filteredData = searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        if (filteredData.length === 0) {
            resultsContainer.innerHTML = '<div style="padding: 1rem; color: #6272a4; font-size: 0.5rem;">No results found...</div>';
            return;
        }

        filteredData.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "spotlight-result" + (index === 0 ? " active" : "");
            div.innerHTML = `
                <div class="spotlight-result-category">${item.category}</div>
                <div class="spotlight-result-title">${item.title}</div>
            `;
            div.addEventListener("click", () => window.location.href = item.url);
            resultsContainer.appendChild(div);
        });
        activeIndex = 0;
    }

    input.addEventListener("input", (e) => {
        renderResults(e.target.value);
    });

    window.addEventListener("keydown", (e) => {
        // Toggle with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            toggleSpotlight();
        }

        if (overlay.style.display === "flex") {
            const results = resultsContainer.querySelectorAll(".spotlight-result");

            if (e.key === "Escape") {
                toggleSpotlight();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % filteredData.length;
                updateActiveResult(results);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + filteredData.length) % filteredData.length;
                updateActiveResult(results);
            } else if (e.key === "Enter" && activeIndex !== -1) {
                window.location.href = filteredData[activeIndex].url;
            }
        }
    });

    function updateActiveResult(results) {
        results.forEach((res, idx) => {
            res.classList.toggle("active", idx === activeIndex);
            if (idx === activeIndex) {
                res.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) toggleSpotlight();
    });
});
