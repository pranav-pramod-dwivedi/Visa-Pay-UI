let currentPayee = "";
let currentAmount = "";
let passcode = "";

// 1. UNIVERSAL PAY
function openUniversalPay() {
    const modal = document.getElementById('universal-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    // Reset
    const amtStage = document.getElementById('amount-stage');
    if (amtStage) {
        amtStage.classList.remove('active');
        amtStage.style.display = 'none';
    }
    const sug = document.querySelector('.suggestions');
    if (sug) {
        sug.style.display = 'flex';
        // Reset search visibility
        const cards = sug.querySelectorAll('.pay-contact-card, :scope > div, .suggestion-item');
        cards.forEach(card => card.style.display = '');
    }
    const searchInp = document.getElementById('pay-search-input');
    if (searchInp) {
        searchInp.value = "";
        searchInp.focus();
    }
}

function selectUser(name, type, src) {
    currentPayee = name;
    
    // Hide suggestions, show amount
    const sug = document.querySelector('.suggestions');
    if (sug) sug.style.display = 'none';
    const amountStage = document.getElementById('amount-stage');
    if (amountStage) {
        amountStage.style.display = 'block';
        amountStage.classList.add('active');
    }

    // Update Avatar
    const avatar = document.getElementById('up-avatar');
    if (avatar) {
        if (type === 'img') {
            avatar.innerHTML = '';
            avatar.style.backgroundImage = `url('${src}')`;
        } else if (type === 'icon') {
            avatar.style.backgroundImage = 'none';
            avatar.innerHTML = `<div class="w-full h-full bg-red-600 flex items-center justify-center text-white font-black">N</div>`;
        } else {
            avatar.style.backgroundImage = 'none';
            avatar.innerHTML = `<div class="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">${src}</div>`;
        }
    }
    
    const nameEl = document.getElementById('up-name');
    if (nameEl) nameEl.innerText = name;

    const amtInp = document.getElementById('payment-amount');
    if (amtInp) {
        amtInp.value = "";
        setTimeout(() => amtInp.focus(), 150);
    }
}

function checkUsername() {
    const valEl = document.getElementById('pay-search-input');
    if (!valEl) return;
    const q = valEl.value.trim().toLowerCase();
    const sug = document.querySelector('.suggestions');
    if (!sug) return;

    const cards = sug.querySelectorAll(':scope > div, .suggestion-item, .pay-contact-card');
    cards.forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        if (!q || text.includes(q)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function setQuickAmount(amt) {
    const amtEl = document.getElementById('payment-amount');
    if (amtEl) {
        amtEl.value = amt;
        amtEl.classList.remove('border-red-500');
        amtEl.focus();
    }
}

function goToPasscode() {
    const amtEl = document.getElementById('payment-amount');
    currentAmount = amtEl ? amtEl.value.trim().replace(/[^0-9.]/g, '') : "";
    const parsed = parseFloat(currentAmount);
    if (!currentAmount || isNaN(parsed) || parsed <= 0 || parsed > 1000000) {
        if (amtEl) {
            amtEl.classList.add('border-red-500');
            amtEl.focus();
            setTimeout(() => amtEl.classList.remove('border-red-500'), 1500);
        }
        return;
    }

    currentAmount = parsed.toFixed(2);

    // Close Universal, Open Passcode
    const uniModal = document.getElementById('universal-modal');
    if (uniModal) uniModal.classList.remove('active');
    setTimeout(() => {
        if (uniModal) uniModal.style.display = 'none';
        clearKey();
        const passModal = document.getElementById('passcode-modal');
        if (passModal) passModal.style.display = 'flex';
    }, 300);
}

// 2. PASSCODE
function tapKey(n) {
    if (passcode.length < 4) {
        passcode += n;
        updateDots();
        if (passcode.length === 4) setTimeout(checkPass, 300);
    }
}
function updateDots() {
    document.querySelectorAll('.dot').forEach((d, i) => {
        if (i < passcode.length) d.classList.add('filled');
        else d.classList.remove('filled');
    });
}
function clearKey() { passcode = ""; updateDots(); }

function checkPass() {
    if (passcode === '0511') {
        playSuccess();
    } else {
        const pad = document.querySelector('.numpad');
        if (pad) {
            pad.classList.add('shake');
            setTimeout(() => { pad.classList.remove('shake'); clearKey(); }, 400);
        } else {
            clearKey();
        }
    }
}

// 3. SUCCESS
function playSuccess() {
    const passModal = document.getElementById('passcode-modal');
    if (passModal) passModal.style.display = 'none';
    const screen = document.getElementById('success-overlay');
    if (screen) screen.style.display = 'flex';
    
    const amtEl = document.getElementById('final-amt');
    if (amtEl) amtEl.innerText = '$' + currentAmount;
    const userEl = document.getElementById('final-user');
    if (userEl) userEl.innerText = currentPayee || 'Merchant';
}

function closeSuccess() { location.reload(); }
function closeModals() {
    const passModal = document.getElementById('passcode-modal');
    if (passModal) passModal.style.display = 'none';
    const uniModal = document.getElementById('universal-modal');
    if (uniModal) {
        uniModal.classList.remove('active');
        setTimeout(() => uniModal.style.display = 'none', 300);
    }
}

// Close on outside click
window.onclick = function(e) {
    const modal = document.getElementById('universal-modal');
    const passcodeModal = document.getElementById('passcode-modal');
    if (e.target === modal || e.target === passcodeModal) closeModals();
};

// Keyboard support for Enter, Escape, and PIN input
document.addEventListener('keydown', function(e) {
    const successOverlay = document.getElementById('success-overlay');
    const isSuccessOpen = successOverlay && successOverlay.style.display === 'flex';
    if (isSuccessOpen) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            closeSuccess();
            return;
        }
    }

    const passcodeModal = document.getElementById('passcode-modal');
    const isPasscodeOpen = passcodeModal && passcodeModal.style.display === 'flex';

    if (e.key === 'Escape') {
        closeModals();
        return;
    }

    if (isPasscodeOpen) {
        if (e.key >= '0' && e.key <= '9') {
            tapKey(e.key);
        } else if (e.key === 'Backspace') {
            passcode = passcode.slice(0, -1);
            updateDots();
        }
    } else {
        const amtEl = document.getElementById('payment-amount');
        const searchInp = document.getElementById('pay-search-input');
        if (amtEl && document.activeElement === amtEl && e.key === 'Enter') {
            goToPasscode();
        } else if (searchInp && document.activeElement === searchInp && e.key === 'Enter') {
            const sug = document.querySelector('.suggestions');
            if (sug) {
                const visible = Array.from(sug.querySelectorAll(':scope > div, .suggestion-item, .pay-contact-card')).find(c => c.style.display !== 'none');
                if (visible) {
                    e.preventDefault();
                    visible.click();
                }
            }
        }
    }
});