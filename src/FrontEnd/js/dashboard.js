import { logout } from './api.js';

class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.setupEventListeners();
        this.mostrarInfoUsuario();
    }

    // Verificar autenticação
    checkAuth() {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            alert('Você precisa fazer login para acessar o dashboard');
            window.location.href = 'login.html';
            return;
        }
    }

    // Carregar dados do usuário
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData;
    }

    // Mostrar informações do usuário na página
    mostrarInfoUsuario() {
        const userData = this.loadUserData();
        if (userData) {
            // Atualizar elementos na página
            const userNameElements = document.querySelectorAll('.user-name, #userName');
            const userEmailElements = document.querySelectorAll('.user-email, #userEmail');
            
            userNameElements.forEach(el => {
                el.textContent = userData.nome;
            });
            
            userEmailElements.forEach(el => {
                el.textContent = userData.email;
            });

            // Atualizar título da página
            document.title = `Dashboard - ${userData.nome}`;
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Tem certeza que deseja sair?')) {
                    logout();
                }
            });
        }

        // Navegação entre seções
        this.setupNavigation();
    }

    // Configurar navegação
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, [data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href') || link.getAttribute('data-section');
                this.loadSection(target);
            });
        });

        // Carregar seção padrão
        this.loadSection('inicio');
    }

    // Carregar seção
    loadSection(section) {
        console.log('Carregando seção:', section);
        
        // Esconder todas as seções
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(sec => {
            sec.style.display = 'none';
        });

        // Mostrar seção selecionada
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Atualizar link ativo
        const navLinks = document.querySelectorAll('.nav-link, [data-section]');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[href="#${section}"], [data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Carregar conteúdo específico da seção
        this.carregarConteudoSection(section);
    }

    // Carregar conteúdo específico de cada seção
    carregarConteudoSection(section) {
        const userData = this.loadUserData();
        
        switch(section) {
            case 'inicio':
                this.carregarInicio(userData);
                break;
            case 'perfil':
                this.carregarPerfil(userData);
                break;
            case 'configuracoes':
                this.carregarConfiguracoes();
                break;
            default:
                this.carregarInicio(userData);
        }
    }

    carregarInicio(userData) {
        const welcomeElement = document.querySelector('#inicio .welcome-message');
        if (welcomeElement) {
            welcomeElement.innerHTML = `
                <h2>Bem-vindo, ${userData.nome}! 👋</h2>
                <p>Email: ${userData.email}</p>
                <p>ID: ${userData.id}</p>
                <p>Seu dashboard está funcionando perfeitamente!</p>
            `;
        }
    }

    carregarPerfil(userData) {
        const perfilElement = document.querySelector('#perfil .profile-content');
        if (perfilElement) {
            perfilElement.innerHTML = `
                <div class="profile-card">
                    <h3>Seu Perfil</h3>
                    <div class="profile-info">
                        <p><strong>Nome:</strong> ${userData.nome}</p>
                        <p><strong>Email:</strong> ${userData.email}</p>
                        <p><strong>ID do Usuário:</strong> ${userData.id}</p>
                    </div>
                </div>
            `;
        }
    }

    carregarConfiguracoes() {
        const settingsElement = document.querySelector('#configuracoes .settings-content');
        if (settingsElement) {
            settingsElement.innerHTML = `
                <div class="settings-card">
                    <h3>Configurações</h3>
                    <p>Área de configurações em desenvolvimento...</p>
                </div>
            `;
        }
    }
}

// Inicializar dashboard quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});