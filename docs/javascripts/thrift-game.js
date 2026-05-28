document.addEventListener("DOMContentLoaded", function () {
    const games = document.querySelectorAll(".thrift-mini-game");
    if (!games.length) return;

    const defaultSteps = [
        {
            label: "Field 1: i32 header + value",
            range: [0, 6],
            explanation:
                "08 = i32 type, 00 01 = field id 1, 00 00 01 00 = value 256 (big-endian)."
        },
        {
            label: "Field 2: string header",
            range: [7, 9],
            explanation:
                "0b = string type, 00 02 = field id 2."
        },
        {
            label: "Field 2: string length + bytes",
            range: [10, 16],
            explanation:
                "00 00 00 03 = length 3, 43 75 70 = UTF-8 bytes for \"Cup\"."
        },
        {
            label: "Field 3: bool",
            range: [17, 20],
            explanation:
                "02 = bool type, 00 03 = field id 3, 01 = true."
        },
        {
            label: "STOP marker",
            range: [21, 21],
            explanation:
                "00 tells the parser the struct has ended."
        }
    ];

    games.forEach((game) => {
        const stream = (game.dataset.bytes || "").trim();
        if (!stream) return;
        let steps = defaultSteps;
        if (game.dataset.steps) {
            try {
                const parsed = JSON.parse(game.dataset.steps);
                if (Array.isArray(parsed) && parsed.length) {
                    steps = parsed;
                }
            } catch (error) {
                steps = defaultSteps;
            }
        }

        const bytes = stream.split(/\s+/);

        const bytesRow = game.querySelector(".thrift-bytes-row");
        const stepLabel = game.querySelector(".thrift-step-label");
        const stepExplain = game.querySelector(".thrift-step-explain");
        const progress = game.querySelector(".thrift-progress");
        const prevBtn = game.querySelector(".thrift-prev");
        const nextBtn = game.querySelector(".thrift-next");
        const autoBtn = game.querySelector(".thrift-auto");
        const resetBtn = game.querySelector(".thrift-reset");

        if (!bytesRow || !stepLabel || !stepExplain || !progress) return;

        bytesRow.innerHTML = "";
        bytes.forEach((b, idx) => {
            const chip = document.createElement("span");
            chip.className = "thrift-byte-chip";
            chip.dataset.idx = String(idx);
            chip.textContent = b;
            bytesRow.appendChild(chip);
        });

        const chips = Array.from(bytesRow.querySelectorAll(".thrift-byte-chip"));
        let currentStep = 0;
        let autoTimer = null;

        function paintStep() {
            const step = steps[currentStep];
            const start = step.range[0];
            const end = step.range[1];

            chips.forEach((chip, idx) => {
                chip.classList.remove("active", "dimmed");
                if (idx >= start && idx <= end) {
                    chip.classList.add("active");
                } else {
                    chip.classList.add("dimmed");
                }
            });

            stepLabel.textContent = step.label;
            stepExplain.textContent = step.explanation;
            progress.textContent = "Step " + (currentStep + 1) + " / " + steps.length;
            if (prevBtn) prevBtn.disabled = currentStep === 0;
            if (nextBtn) nextBtn.disabled = currentStep === steps.length - 1;
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
            if (autoBtn) autoBtn.textContent = "Auto Play";
        }

        function goToStep(idx) {
            currentStep = Math.max(0, Math.min(steps.length - 1, idx));
            paintStep();
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                stopAuto();
                goToStep(currentStep - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                stopAuto();
                goToStep(currentStep + 1);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                stopAuto();
                goToStep(0);
            });
        }

        if (autoBtn) {
            autoBtn.addEventListener("click", function () {
                if (autoTimer) {
                    stopAuto();
                    return;
                }

                autoBtn.textContent = "Pause";
                autoTimer = setInterval(function () {
                    if (currentStep >= steps.length - 1) {
                        stopAuto();
                        return;
                    }
                    goToStep(currentStep + 1);
                }, 1200);
            });
        }

        goToStep(0);
    });
});
