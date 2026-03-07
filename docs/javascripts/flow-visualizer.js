document.addEventListener("DOMContentLoaded", function () {
    const visualizers = document.querySelectorAll(".flow-visualizer-container");

    visualizers.forEach(container => {
        const nodesData = JSON.parse(container.dataset.nodes || "[]");
        const nodesContainer = container.querySelector(".flow-nodes");
        const packet = container.querySelector(".flow-packet");
        const traceBtn = container.querySelector(".trace-btn");
        const resetBtn = container.querySelector(".reset-btn");

        if (!nodesData.length || !nodesContainer || !packet) return;

        // Render nodes
        nodesContainer.innerHTML = '';
        nodesContainer.appendChild(packet); // Keep packet inside

        const connector = document.createElement("div");
        connector.className = "flow-connector";
        nodesContainer.appendChild(connector);

        const nodeElements = [];

        nodesData.forEach((node, index) => {
            const nodeEl = document.createElement("div");
            nodeEl.className = "flow-node";
            nodeEl.innerHTML = `
                ${node}
                <div class="flow-label">Step ${index + 1}</div>
            `;
            nodesContainer.appendChild(nodeEl);
            nodeElements.push(nodeEl);
        });

        let isAnimating = false;

        async function animateFlow() {
            if (isAnimating) return;
            isAnimating = true;
            traceBtn.disabled = true;

            packet.style.display = "block";

            for (let i = 0; i < nodeElements.length; i++) {
                const currentEl = nodeElements[i];
                const rect = currentEl.getBoundingClientRect();
                const containerRect = nodesContainer.getBoundingClientRect();

                const targetX = rect.left - containerRect.left + (rect.width / 2);
                const targetY = rect.top - containerRect.top + (rect.height / 2);

                // Move packet
                packet.style.transition = i === 0 ? "none" : "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                packet.style.left = `${targetX}px`;
                packet.style.top = `${targetY}px`;

                if (i > 0) await new Promise(r => setTimeout(r, 600));

                // Activate node
                nodeElements.forEach(el => el.classList.remove("active"));
                currentEl.classList.add("active");

                await new Promise(r => setTimeout(r, 400));
            }

            isAnimating = false;
            traceBtn.disabled = false;
        }

        function resetFlow() {
            if (isAnimating) return;
            nodeElements.forEach(el => el.classList.remove("active"));
            packet.style.display = "none";
        }

        traceBtn.addEventListener("click", animateFlow);
        resetBtn.addEventListener("click", resetFlow);
    });
});
