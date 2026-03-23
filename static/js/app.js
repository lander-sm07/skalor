/* ═══════════════════════════════════════════
   CodeQuest — Client-side JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

    // ── Tab Navigation ────────────────────
    const tabs    = document.querySelectorAll(".tab");
    const panels  = document.querySelectorAll(".panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove("tab--active"));
            tab.classList.add("tab--active");

            panels.forEach(p => p.classList.remove("panel--active"));
            document.getElementById(`panel-${target}`).classList.add("panel--active");
        });
    });


    // ── Skill Cards → Modal ───────────────
    const modal         = document.getElementById("skill-modal");
    const backdrop      = modal.querySelector(".modal__backdrop");
    const modalName     = document.getElementById("modal-skill-name");
    const modalDesc     = document.getElementById("modal-skill-desc");
    const modalXp       = document.getElementById("modal-skill-xp");
    const modalStartBtn = document.getElementById("modal-start-btn");

    let currentSkillId = null;
    let currentSkillXp = 0;

    document.querySelectorAll(".skill-card:not(.skill-card--locked):not(.skill-card--done)").forEach(card => {
        card.addEventListener("click", () => {
            currentSkillId = card.dataset.skillId;
            currentSkillXp = parseInt(card.dataset.skillXp, 10);

            modalName.textContent = card.dataset.skillName;
            modalDesc.textContent = card.dataset.skillDesc;
            modalXp.textContent   = `+${card.dataset.skillXp} XP bij voltooiing`;

            modal.classList.add("modal--open");
        });
    });

    // Sluit modal
    backdrop.addEventListener("click", closeModal);

    function closeModal() {
        modal.classList.remove("modal--open");
        currentSkillId = null;
    }


    // ── Complete Skill ────────────────────
    modalStartBtn.addEventListener("click", async () => {
        if (!currentSkillId) return;

        try {
            const res = await fetch("/api/complete-skill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skill_id: currentSkillId }),
            });
            const data = await res.json();

            if (data.success) {
                updateUI(data.player);
                showToast(`✅ +${data.earned_xp} XP  |  +${data.earned_coins} 🪙`);

                // Markeer kaart als voltooid
                const card = document.querySelector(`[data-skill-id="${currentSkillId}"]`);
                if (card) {
                    card.classList.add("skill-card--done");
                    card.style.pointerEvents = "none";

                    // Voeg check toe
                    const check = document.createElement("div");
                    check.className = "skill-card__check";
                    check.textContent = "✅";
                    card.appendChild(check);

                    // Vul de voortgangsbalk
                    const bar = card.querySelector(".skill-card__bar-fill");
                    if (bar) bar.style.width = "100%";
                }
            } else {
                showToast(`⚠️ ${data.error}`);
            }
        } catch (err) {
            showToast("❌ Er ging iets mis");
            console.error(err);
        }

        closeModal();
    });


    // ── Shop — Buy Items ──────────────────
    document.querySelectorAll(".shop-item:not(.shop-item--bought)").forEach(item => {
        const btn = item.querySelector(".shop-item__btn");

        btn.addEventListener("click", async () => {
            const itemId = item.dataset.itemId;

            try {
                const res = await fetch("/api/buy-item", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ item_id: itemId }),
                });
                const data = await res.json();

                if (data.success) {
                    updateUI(data.player);
                    item.classList.add("shop-item--bought");
                    btn.textContent = "✅ Gekocht";
                    btn.classList.add("shop-item__btn--bought");
                    btn.disabled = true;
                    showToast("🛒 Item gekocht!");
                } else {
                    showToast(`⚠️ ${data.error}`);
                }
            } catch (err) {
                showToast("❌ Er ging iets mis");
                console.error(err);
            }
        });
    });


    // ── Update UI met nieuwe spelerdata ───
    function updateUI(player) {
        // Stats in header
        document.getElementById("coins-display").textContent = player.coins;
        document.getElementById("xp-display").textContent    = player.xp;
        document.getElementById("level-display").textContent  = player.level;
        document.getElementById("avatar-level").textContent   = player.level;

        // XP bar
        const nextLevelXp = (player.level + 1) * 500;
        const progress    = (player.xp % 500) / 500 * 100;
        document.getElementById("xp-bar-fill").style.width          = `${progress}%`;
        document.getElementById("xp-progress-text").textContent     = player.xp;
    }


    // ── Toast Notificatie ─────────────────
    function showToast(message) {
        const toast   = document.getElementById("toast");
        const msgSpan = document.getElementById("toast-message");

        msgSpan.textContent = message;
        toast.classList.add("toast--visible");

        setTimeout(() => {
            toast.classList.remove("toast--visible");
        }, 2500);
    }

});
