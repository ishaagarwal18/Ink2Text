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
        // Validate password strength
        const validation = this.validatePasswordStrength(password);
        if (!validation.isValid) {
            showToast('Weak Password', validation.message, 'error');
            return false;
        }

        const user = { name, email, signupTime: Date.now() };
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
        return true;
    },

    validatePasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const failedRequirements = [];
        if (!requirements.length) failedRequirements.push('at least 8 characters');
        if (!requirements.uppercase) failedRequirements.push('one uppercase letter');
        if (!requirements.lowercase) failedRequirements.push('one lowercase letter');
        if (!requirements.number) failedRequirements.push('one number');
        if (!requirements.special) failedRequirements.push('one special character');

        const isValid = Object.values(requirements).every(req => req);

        return {
            isValid,
            requirements,
            message: isValid ? 'Strong password' : `Password must contain ${failedRequirements.join(', ')}`
        };
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
            
            // Update user info in dropdown
            const userName = document.getElementById('userNameDropdown');
            const userEmail = document.getElementById('userEmailDropdown');
            const userInitial = document.getElementById('userInitial');
            
            if (userName) userName.textContent = user.name || user.email.split('@')[0];
            if (userEmail) userEmail.textContent = user.email;
            if (userInitial) userInitial.textContent = (user.name || user.email)[0].toUpperCase();
        } else {
            authButtons.style.display = 'flex';
            logoutButton.style.display = 'none';
        }
        
        // Update history button visibility
        HistoryManager.updateHistoryButton();
    }
};

// Backend API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// History Manager - Now uses Backend API
const HistoryManager = {
    async getHistory() {
        // Only return history if user is logged in
        const user = AuthManager.getUser();
        if (!user) return [];
        
        try {
            const response = await fetch(`${API_BASE_URL}/history`);
            const data = await response.json();
            
            if (data.success) {
                return data.history;
            } else {
                console.error('Failed to fetch history:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    },

    async addToHistory(text, fileName) {
        // History is automatically saved by backend when OCR is processed
        // This method is kept for compatibility but doesn't need to do anything
        this.updateHistoryButton();
    },

    async clearHistory() {
        try {
            const history = await this.getHistory();
            
            // Delete all documents
            for (const item of history) {
                await fetch(`${API_BASE_URL}/history/${item.document_id}`, {
                    method: 'DELETE'
                });
            }
            
            this.updateHistoryButton();
            showToast('History cleared', 'success');
        } catch (error) {
            console.error('Error clearing history:', error);
            showToast('Failed to clear history', 'error');
        }
    },

    async loadFromHistory(id) {
        const history = await this.getHistory();
        const item = history.find(h => h.document_id === parseInt(id));
        if (item) {
            document.getElementById('extractedText').value = item.text;
            showToast('Loaded from history', 'success');
            toggleHistory(); // Close history panel
        }
    },

    async updateHistoryButton() {
        const historyBtn = document.querySelector('button[onclick="toggleHistory()"]');
        if (!historyBtn) return;
        
        const user = AuthManager.getUser();
        const history = await this.getHistory();
        
        // Show/hide history button based on login status
        if (user) {
            historyBtn.style.display = 'inline-flex';
            // Update button text with count
            const count = history.length;
            if (count > 0) {
                historyBtn.innerHTML = `📜 History (${count})`;
            } else {
                historyBtn.innerHTML = '📜 History';
            }
        } else {
            historyBtn.style.display = 'none';
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
    const icon = btn.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.toggle('show');
    menuToggle.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.remove('show');
    menuToggle.classList.remove('active');
}

// User Menu Functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function closeUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.remove('show');
}

// Close user dropdown when clicking outside
document.addEventListener('click', (event) => {
    const userSection = document.querySelector('.user-section');
    const dropdown = document.getElementById('userDropdown');
    
    if (userSection && dropdown && !userSection.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

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

    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }

    // Validate password strength for login as well
    const validation = AuthManager.validatePasswordStrength(password);
    if (!validation.isValid) {
        showToast('Invalid Password', 'Password does not meet security requirements. ' + validation.message, 'error');
        return;
    }

    if (AuthManager.login(email, password)) {
        showToast('Login successful!', 'success');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        goToPage('home');
    }
}

// Password Strength Validator for Login
function validateLoginPassword() {
    const password = document.getElementById('loginPassword').value;
    const strengthBar = document.getElementById('loginPasswordStrength');
    const requirementsDiv = document.getElementById('loginPasswordRequirements');
    
    if (!password) {
        strengthBar.className = 'password-strength';
        requirementsDiv.style.display = 'none';
        resetLoginPasswordRequirements();
        return;
    }

    // Show requirements when user starts typing
    requirementsDiv.style.display = 'block';

    const validation = AuthManager.validatePasswordStrength(password);
    const requirements = validation.requirements;

    // Update requirement checkmarks
    document.getElementById('login-req-length').className = requirements.length ? 'valid' : '';
    document.getElementById('login-req-uppercase').className = requirements.uppercase ? 'valid' : '';
    document.getElementById('login-req-lowercase').className = requirements.lowercase ? 'valid' : '';
    document.getElementById('login-req-number').className = requirements.number ? 'valid' : '';
    document.getElementById('login-req-special').className = requirements.special ? 'valid' : '';

    // Calculate strength
    const validCount = Object.values(requirements).filter(Boolean).length;
    
    if (validCount <= 2) {
        strengthBar.className = 'password-strength weak';
    } else if (validCount <= 4) {
        strengthBar.className = 'password-strength medium';
    } else {
        strengthBar.className = 'password-strength strong';
    }
}

function resetLoginPasswordRequirements() {
    document.getElementById('login-req-length').className = '';
    document.getElementById('login-req-uppercase').className = '';
    document.getElementById('login-req-lowercase').className = '';
    document.getElementById('login-req-number').className = '';
    document.getElementById('login-req-special').className = '';
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

    // Validate password strength
    const validation = AuthManager.validatePasswordStrength(password);
    if (!validation.isValid) {
        showToast('Weak Password', validation.message, 'error');
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

// Password Strength Validator
function validatePassword() {
    const password = document.getElementById('signupPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthBar.className = 'password-strength';
        resetPasswordRequirements();
        return;
    }

    const validation = AuthManager.validatePasswordStrength(password);
    const requirements = validation.requirements;

    // Update requirement checkmarks
    document.getElementById('req-length').className = requirements.length ? 'valid' : '';
    document.getElementById('req-uppercase').className = requirements.uppercase ? 'valid' : '';
    document.getElementById('req-lowercase').className = requirements.lowercase ? 'valid' : '';
    document.getElementById('req-number').className = requirements.number ? 'valid' : '';
    document.getElementById('req-special').className = requirements.special ? 'valid' : '';

    // Calculate strength
    const validCount = Object.values(requirements).filter(Boolean).length;
    
    if (validCount <= 2) {
        strengthBar.className = 'password-strength weak';
    } else if (validCount <= 4) {
        strengthBar.className = 'password-strength medium';
    } else {
        strengthBar.className = 'password-strength strong';
    }
}

function resetPasswordRequirements() {
    document.getElementById('req-length').className = '';
    document.getElementById('req-uppercase').className = '';
    document.getElementById('req-lowercase').className = '';
    document.getElementById('req-number').className = '';
    document.getElementById('req-special').className = '';
}

function logout() {
    // Clear history when logging out (no need to clear from DB, just local state)
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

    const user = AuthManager.getUser();
    if (!user) {
        showToast('Please login to use OCR', 'error');
        showLoginModal();
        return;
    }

    const btn = document.getElementById('processBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Processing...';

    try {
        // Create FormData to send image to backend
        const formData = new FormData();
        formData.append('image', converterState.imageFile);

        // Send to backend API
        const response = await fetch(`${API_BASE_URL}/ocr`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('extractedText').value = data.text;
            await HistoryManager.updateHistoryButton();
            showToast('Text extracted and saved to database!', 'success');
        } else {
            throw new Error(data.error || 'OCR processing failed');
        }
    } catch (error) {
        console.error('OCR Error:', error);
        showToast('Failed to process image: ' + error.message, 'error');
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

async function toggleHistory() {
    const user = AuthManager.getUser();
    if (!user) {
        showLoginModal();
        return;
    }
    
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.classList.toggle('show');

    if (historyPanel.classList.contains('show')) {
        // Show loading
        historyPanel.innerHTML = '<p style="text-align: center; color: var(--muted-foreground); padding: 20px;">Loading history...</p>';
        
        const history = await HistoryManager.getHistory();
        
        if (history.length === 0) {
            historyPanel.innerHTML = '<p style="text-align: center; color: var(--muted-foreground); padding: 20px;">No history yet. Start converting images!</p>';
            return;
        }

        historyPanel.innerHTML = history.map(item => `
            <div class="history-item" onclick="HistoryManager.loadFromHistory('${item.document_id}')">
                <div class="history-item-name">${escapeHtml(item.file_name)}</div>
                <div class="history-item-preview">${escapeHtml(item.text.slice(0, 50))}...</div>
                <div class="history-item-time">${item.uploaded_at}</div>
            </div>
        `).join('') + '<button onclick="HistoryManager.clearHistory(); toggleHistory()" style="width: 100%; margin-top: 10px; background: #ff6b6b; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Clear All History</button>';
    }
}

// Login Modal Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setActiveNav(link) {
    document.querySelectorAll('.nav-links a')
        .forEach(a => a.classList.remove('active'));
    link.classList.add('active');
}


// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    AuthManager.updateUI();
    HistoryManager.updateHistoryButton(); // Initialize history button state
});
