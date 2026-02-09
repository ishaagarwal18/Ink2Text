// Authentication Manager
const AuthManager = {
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    login(email, password) {
        const user = { email, name: email.split('@')[0], loginTime: Date.now() };
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
        return true;
    },

    signup(name, email, password) {
        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return false;
        }
        const user = { name, email, signupTime: Date.now() };
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
        return true;
    },

    logout() {
        localStorage.removeItem('user');
        this.updateUI();
    },

    updateUI() {
        const user = this.getUser();
        const authButtons = document.getElementById('authButtons');
        const logoutButton = document.getElementById('logoutButton');

        if (user) {
            authButtons.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            authButtons.style.display = 'flex';
            logoutButton.style.display = 'none';
        }
    }
};

// History Manager
const HistoryManager = {
    getHistory() {
        const history = localStorage.getItem('ocr-history');
        return history ? JSON.parse(history) : [];
    },

    addToHistory(text, fileName) {
        const history = this.getHistory();
        const item = {
            id: Date.now().toString(),
            text,
            fileName,
            timestamp: Date.now()
        };
        const updated = [item, ...history].slice(0, 20);
        localStorage.setItem('ocr-history', JSON.stringify(updated));
    },

    clearHistory() {
        localStorage.removeItem('ocr-history');
    },

    loadFromHistory(id) {
        const history = this.getHistory();
        const item = history.find(h => h.id === id);
        if (item) {
            document.getElementById('extractedText').value = item.text;
            showToast('Loaded from history', 'success');
        }
    }
};

// Theme Manager
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('ink2text-theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            this.setDarkMode();
        } else {
            this.setLightMode();
        }
    },

    setDarkMode() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('ink2text-theme', 'dark');
        updateThemeIcon();
    },

    setLightMode() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('ink2text-theme', 'light');
        updateThemeIcon();
    },

    toggle() {
        if (document.documentElement.classList.contains('dark')) {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }
    }
};

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// Theme Toggle
function toggleTheme() {
    ThemeManager.toggle();
}

function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle');
    const isDark = document.documentElement.classList.contains('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
}

// Page Navigation
function goToPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    window.scrollTo(0, 0);
}

// Authentication Forms
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (AuthManager.login(email, password)) {
        showToast('Login successful!', 'success');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        goToPage('home');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (AuthManager.signup(name, email, password)) {
        showToast('Account created successfully!', 'success');
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirm').value = '';
        goToPage('home');
    }
}

function logout() {
    AuthManager.logout();
    showToast('Logged out successfully', 'success');
    goToPage('home');
}

// OCR Converter
const converterState = {
    imageFile: null,
    imageData: null
};

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

uploadArea.addEventListener('click', () => imageInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageSelect(file);
});

function handleImageSelect(file) {
    if (!file.type.match(/image\/(jpeg|png|jpg|webp)/)) {
        showToast('Please upload JPG, PNG, or WebP images', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be smaller than 5MB', 'error');
        return;
    }

    converterState.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        converterState.imageData = e.target.result;
        imagePreview.src = converterState.imageData;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

async function processImage() {
    if (!converterState.imageData) {
        showToast('Please upload an image first', 'error');
        return;
    }

    const btn = document.getElementById('processBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Processing...';

    try {
        // Load Tesseract.js
        const { createWorker } = await import('https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/+esm');
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(converterState.imageData);
        await worker.terminate();

        document.getElementById('extractedText').value = text;
        HistoryManager.addToHistory(text, converterState.imageFile?.name || 'Untitled');
        showToast('Text extracted successfully!', 'success');
    } catch (error) {
        console.error('[v0] OCR Error:', error);
        showToast('Failed to process image. Try a clearer image.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🔄 Process';
    }
}

function copyText() {
    const text = document.getElementById('extractedText').value;
    if (!text) {
        showToast('No text to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('Text copied to clipboard!', 'success');
    });
}

function saveAs() {
    const text = document.getElementById('extractedText').value;
    if (!text) {
        showToast('No text to save', 'error');
        return;
    }

    if (window.showSaveFilePicker) {
        window.showSaveFilePicker({
            suggestedName: `ink2text-${new Date().toISOString().slice(0, 10)}.txt`,
            types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }]
        }).then(async (handle) => {
            const writable = await handle.createWritable();
            await writable.write(text);
            await writable.close();
            showToast('File saved successfully!', 'success');
        }).catch(err => {
            if (err.name !== 'AbortError') {
                downloadText();
            }
        });
    } else {
        downloadText();
    }
}

function downloadText() {
    const text = document.getElementById('extractedText').value;
    if (!text) {
        showToast('No text to download', 'error');
        return;
    }

    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    element.download = `ink2text-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Text downloaded!', 'success');
}

function resetConverter() {
    converterState.imageFile = null;
    converterState.imageData = null;
    imageInput.value = '';
    imagePreview.style.display = 'none';
    document.getElementById('extractedText').value = '';
}

function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.classList.toggle('show');

    if (historyPanel.classList.contains('show')) {
        const history = HistoryManager.getHistory();
        if (history.length === 0) {
            historyPanel.innerHTML = '<p style="text-align: center; color: var(--muted-foreground);">No history yet</p>';
            return;
        }

        historyPanel.innerHTML = history.map(item => `
            <div class="history-item" onclick="HistoryManager.loadFromHistory('${item.id}')">
                <div class="history-item-name">${item.fileName}</div>
                <div class="history-item-preview">${item.text.slice(0, 50)}...</div>
                <div class="history-item-time">${new Date(item.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('') + '<button onclick="HistoryManager.clearHistory(); toggleHistory()" style="width: 100%; margin-top: 10px; background: #ff6b6b; color: white; border: none;">Clear History</button>';
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    AuthManager.updateUI();
});
