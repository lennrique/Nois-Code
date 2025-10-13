<link rel="stylesheet" href="nois-code.css"></link>
class AuthService {
    static isAuthenticated() {
        return localStorage.getItem('user') !== null;
    }

    static getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static logout() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    static showMessage(message, type = 'error') {
        // Remove mensagens anteriores
        const existingMessage = document.getElementById('api-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.id = 'api-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
            ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        // Remove após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}