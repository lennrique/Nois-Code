import { api, logout, verificarConexao } from './api.js';

// Gerenciamento de autenticação
class AuthManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.verificarServidor();
        this.checkAuthentication();
        this.setupEventListeners();
        this.setupPasswordToggle();
    }

    // Verificar se servidor está online
    async verificarServidor() {
        const isOnline = await verificarConexao();
        if (!isOnline) {
            this.mostrarAvisoServidor();
        }
    }

    mostrarAvisoServidor() {
        console.error('Servidor offline!');
    }

    // Verificar autenticação - CORRIGIDO
    checkAuthentication() {
        const userData = localStorage.getItem('userData');
        const currentPath = window.location.pathname;
        
        console.log('🔍 Verificando autenticação:', { 
            userData: !!userData, 
            currentPath 
        });

        // Se usuário está logado E está em páginas de auth, redireciona para dashboard
        if (userData && (currentPath.includes('/login') || currentPath.endsWith('login.html'))) {
            console.log('🔄 Usuário logado em /login, redirecionando para dashboard');
            window.location.href = '/dashboard';
            return;
        }

        if (userData && (currentPath.includes('/cadastro') || currentPath.endsWith('cadastro.html'))) {
            console.log('🔄 Usuário logado em /cadastro, redirecionando para dashboard');
            window.location.href = '/dashboard';
            return;
        }
        
        // Se não está logado E está no dashboard, redireciona para login
        if (!userData && (currentPath.includes('/dashboard') || currentPath.endsWith('Dashboard.html'))) {
            console.log('🔄 Usuário não logado em /dashboard, redirecionando para login');
            window.location.href = '/login';
            return;
        }

        // Se está na página inicial e logado, redireciona para dashboard
        if (userData && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/'))) {
            console.log('🔄 Usuário logado na home, redirecionando para dashboard');
            window.location.href = '/dashboard';
            return;
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('✅ Formulário de login encontrado');
            // Salvar texto original do botão
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.getAttribute('data-original-text')) {
                submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
            }
            
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        } else {
            console.log('❌ Formulário de login NÃO encontrado');
        }

        // Cadastro form
        const cadastroForm = document.getElementById('cadastroForm');
        if (cadastroForm) {
            console.log('✅ Formulário de cadastro encontrado');
            // Salvar texto original do botão
            const submitBtn = cadastroForm.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.getAttribute('data-original-text')) {
                submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
            }
            
            cadastroForm.addEventListener('submit', (e) => this.handleCadastro(e));
        } else {
            console.log('❌ Formulário de cadastro NÃO encontrado');
        }

        // Logout buttons
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        });
    }

    // Configurar toggle de senha (olho mágico)
    setupPasswordToggle() {
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('senha');

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Alterar ícone
                const icon = togglePassword.querySelector('i');
                if (type === 'password') {
                    icon.className = 'fas fa-eye';
                } else {
                    icon.className = 'fas fa-eye-slash';
                }
            });
        }
    }

    // Manipular login
    async handleLogin(e) {
        e.preventDefault();
        console.log('🔐 Iniciando processo de login...');
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const captcha = document.getElementById('captcha');
        const errorElement = document.getElementById('loginError');
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');

        // Limpar erro anterior
        this.hideError(errorElement);

        // Validação básica
        if (!email || !senha) {
            this.showError(errorElement, 'Por favor, preencha todos os campos');
            return;
        }

        // Validar CAPTCHA
        if (captcha && !captcha.checked) {
            this.showError(errorElement, 'Por favor, confirme que você não é um robô');
            return;
        }

        // Mostrar loading
        this.toggleLoading(submitBtn, true, 'Entrando...');

        try {
            console.log('📤 Enviando requisição de login...');
            const result = await api.loginUsuario({ email, senha });
            
            if (result.success) {
                // Login bem-sucedido
                console.log('✅ Login bem-sucedido!', result.data.user);
                localStorage.setItem('userData', JSON.stringify(result.data.user));
                localStorage.setItem('userToken', 'authenticated');
                
                this.showSuccess('Login realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                console.log('❌ Erro no login:', result.data.error);
                this.showError(errorElement, result.data.error || 'Email ou senha incorretos');
            }
        } catch (error) {
            console.log('❌ Erro de conexão:', error);
            this.showError(errorElement, 'Erro de conexão com o servidor. Verifique se o servidor está rodando.');
        } finally {
            this.toggleLoading(submitBtn, false);
        }
    }

    // Manipular cadastro
    async handleCadastro(e) {
        e.preventDefault();
        console.log('📝 Iniciando processo de cadastro...');
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const errorElement = document.getElementById('cadastroError');
        const submitBtn = document.querySelector('#cadastroForm button[type="submit"]');

        // Limpar erro anterior
        this.hideError(errorElement);

        // Validações
        if (!nome || !email || !senha || !confirmarSenha) {
            this.showError(errorElement, 'Por favor, preencha todos os campos');
            return;
        }

        if (senha !== confirmarSenha) {
            this.showError(errorElement, 'As senhas não coincidem');
            return;
        }

        if (senha.length < 6) {
            this.showError(errorElement, 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Mostrar loading
        this.toggleLoading(submitBtn, true, 'Cadastrando...');

        try {
            console.log('📤 Enviando requisição de cadastro...');
            const result = await api.cadastrarUsuario({ nome, email, senha });
            
            if (result.success) {
                console.log('✅ Cadastro bem-sucedido!');
                this.showSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                console.log('❌ Erro no cadastro:', result.data.error);
                this.showError(errorElement, result.data.error || 'Erro no cadastro. Tente novamente.');
            }
        } catch (error) {
            console.log('❌ Erro de conexão:', error);
            this.showError(errorElement, 'Erro de conexão com o servidor. Verifique se o servidor está rodando.');
        } finally {
            this.toggleLoading(submitBtn, false);
        }
    }

    // Mostrar erro
    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            
            // Scroll para o erro
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-esconder após 5 segundos
            setTimeout(() => {
                this.hideError(element);
            }, 5000);
        } else {
            // Fallback: alert simples
            alert(`Erro: ${message}`);
        }
    }

    // Esconder erro
    hideError(element) {
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
        }
    }

    // Mostrar sucesso
    showSuccess(message) {
        // Usar alert simples para não quebrar o layout
        alert(`✅ ${message}`);
    }

    // Alternar estado de loading
    toggleLoading(button, isLoading, loadingText = 'Carregando...') {
        if (button) {
            if (isLoading) {
                button.disabled = true;
                button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
                button.classList.add('loading');
            } else {
                button.disabled = false;
                const originalText = button.getAttribute('data-original-text') || 'Entrar';
                button.innerHTML = originalText;
                button.classList.remove('loading');
            }
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 AuthManager inicializando...');
    new AuthManager();
});