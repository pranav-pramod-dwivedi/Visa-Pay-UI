let currentPayee = "";
let currentAmount = "";
let passcode = "";

// 1. UNIVERSAL PAY
function openUniversalPay() {
    const modal = document.getElementById('universal-modal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    // Reset
    document.getElementById('amount-stage').classList.remove('active');
    document.getElementById('amount-stage').style.display = 'none';
    document.querySelector('.suggestions').style.display = 'flex';
    document.getElementById('pay-search-input').value = "";
}

function selectUser(name, type, src) {
    currentPayee = name;
    
    // Hide suggestions, show amount
    document.querySelector('.suggestions').style.display = 'none';
    const amountStage = document.getElementById('amount-stage');
    amountStage.style.display = 'block';
    amountStage.classList.add('active');

    // Update Avatar
    const avatar = document.getElementById('up-avatar');
    if (type === 'img') avatar.style.backgroundImage = `url('${src}')`;
    else if (type === 'icon') {
        avatar.style.backgroundImage = 'none';
        avatar.innerHTML = `<div class="w-full h-full bg-red-600 flex items-center justify-center text-white font-black">N</div>`;
    } else {
        avatar.style.backgroundImage = 'none';
        avatar.innerHTML = `<div class="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">${src}</div>`;
    }
    
    document.getElementById('up-name').innerText = name;
}

function checkUsername() {
    const val = document.getElementById('pay-search-input').value;
    const hint = document.getElementById('visa-hint');
    if (val.length > 3 && !val.includes('@')) {
        // Logic to show hint if needed
    }
}

function goToPasscode() {
    currentAmount = document.getElementById('payment-amount').value;
    if (!currentAmount || currentAmount <= 0) return alert("Enter valid amount");

    // Close Universal, Open Passcode
    document.getElementById('universal-modal').classList.remove('active');
    setTimeout(() => {
        document.getElementById('universal-modal').style.display = 'none';
        document.getElementById('passcode-modal').style.display = 'flex';
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
        pad.classList.add('shake');
        setTimeout(() => { pad.classList.remove('shake'); clearKey(); }, 400);
    }
}

// 3. SUCCESS
function playSuccess() {
    document.getElementById('passcode-modal').style.display = 'none';
    const screen = document.getElementById('success-overlay');
    screen.style.display = 'flex';
    
    document.getElementById('final-amt').innerText = '$' + currentAmount;
    document.getElementById('final-user').innerText = currentPayee;
}

function closeSuccess() { location.reload(); }
function closeModals() {
    document.getElementById('passcode-modal').style.display = 'none';
    document.getElementById('universal-modal').classList.remove('active');
    setTimeout(() => document.getElementById('universal-modal').style.display = 'none', 300);
}

// Close on outside click
window.onclick = function(e) {
    const modal = document.getElementById('universal-modal');
    if (e.target === modal) closeModals();
}