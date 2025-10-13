<link rel="stylesheet" href="nois-code.css"></link>
// Navegação Principal - Nois Code
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧭 Navegação Principal Carregada!');

    // Sistema de Tabs para Exercícios
    const tabButtons = document.querySelectorAll('.tab-btn');
    const exerciseCards = document.querySelectorAll('.exercise-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Ativar tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar exercícios (simulação)
            exerciseCards.forEach(card => {
                if (tab === 'challenges' && card.classList.contains('challenge')) {
                    card.style.display = 'block';
                } else if (tab === 'projects' && card.classList.contains('project')) {
                    card.style.display = 'block';
                } else if (tab === 'quizzes' && card.classList.contains('quiz')) {
                    card.style.display = 'block';
                } else if (tab === 'challenges') {
                    // Mostrar todos para challenges (exemplo)
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Sistema de Interação com Cursos
    const continueButtons = document.querySelectorAll('.btn-continue');
    
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseName = courseCard.querySelector('h3').textContent;
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
            this.disabled = true;
            
            setTimeout(() => {
                alert(`Continuando curso: ${courseName}`);
                // window.location.href = `/curso/${courseName.toLowerCase().replace(' ', '-')}`;
            }, 1000);
        });
    });

    // Sistema de Trilhas
    const pathButtons = document.querySelectorAll('.btn-path');
    
    pathButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pathCard = this.closest('.path-card');
            const pathName = pathCard.querySelector('h3').textContent;
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecionando...';
            
            setTimeout(() => {
                alert(`Iniciando trilha: ${pathName}`);
                // window.location.href = `/trilha/${pathName.toLowerCase().replace(' ', '-')}`;
            }, 800);
        });
    });

    // Sistema de Comunidade
    const communityButtons = document.querySelectorAll('.btn-community');
    
    communityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const communityCard = this.closest('.community-card');
            const communityType = communityCard.querySelector('h3').textContent;
            
            showNotification(`Abrindo ${communityType}...`);
            
            setTimeout(() => {
                // Redirecionamento baseado no tipo de comunidade
                switch(communityType) {
                    case 'Fóruns':
                        window.location.href = '/foruns';
                        break;
                    case 'Grupos de Estudo':
                        window.location.href = '/grupos';
                        break;
                    case 'Ranking':
                        window.location.href = '/ranking';
                        break;
                    default:
                        window.location.href = '/comunidade';
                }
            }, 500);
        });
    });

    // Sistema de Configurações
    const settingButtons = document.querySelectorAll('.btn-setting');
    
    settingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const settingCard = this.closest('.setting-card');
            const settingType = settingCard.querySelector('h3').textContent;
            
            showNotification(`Abrindo ${settingType}...`);
            
            setTimeout(() => {
                // Redirecionamento baseado no tipo de configuração
                switch(settingType) {
                    case 'Editar Perfil':
                        window.location.href = '/perfil/editar';
                        break;
                    case 'Preferências':
                        window.location.href = '/configuracoes/preferencias';
                        break;
                    case 'Segurança':
                        window.location.href = '/configuracoes/seguranca';
                        break;
                    case 'Ajuda & Suporte':
                        window.location.href = '/ajuda';
                        break;
                    default:
                        window.location.href = '/configuracoes';
                }
            }, 500);
        });
    });

    // Função de Notificação
    function showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Busca Inteligente
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
        
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.2)';
            this.parentElement.style.border = '1px solid var(--primary)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            this.parentElement.style.border = '1px solid transparent';
        });
    }

    function performSearch(term) {
        console.log(`🔍 Buscando: ${term}`);
        showNotification(`Buscando por: "${term}"`);
        // Implementar busca real aqui
    }

    // Animações de Entrada
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.course-card, .path-card, .exercise-card, .community-card, .setting-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    // Configurar elementos para animação
    const animatedElements = document.querySelectorAll('.course-card, .path-card, .exercise-card, .community-card, .setting-card');
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    console.log('✅ Navegação Principal inicializada com sucesso!');
});

// Utilitários da Navegação
const NavigationUtils = {
    // Navegação Rápida
    quickNavigate(section) {
        const targetElement = document.querySelector(`.${section}`);
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Destaque visual
            targetElement.style.boxShadow = '0 0 0 2px var(--primary)';
            setTimeout(() => {
                targetElement.style.boxShadow = '';
            }, 2000);
        }
    },

    // Progresso em Tempo Real
    updateCourseProgress(courseId, progress) {
        const progressElement = document.querySelector(`[data-course="${courseId}"] .progress`);
        if (progressElement) {
            progressElement.style.width = `${progress}%`;
            progressElement.nextElementSibling.textContent = `${progress}%`;
        }
    },

    // Estatísticas da Comunidade
    updateCommunityStats() {
        // Simular atualização de stats
        const stats = {
            forums: Math.floor(Math.random() * 50) + 1200,
            groups: Math.floor(Math.random() * 5) + 15,
            ranking: Math.floor(Math.random() * 10) + 40
        };
        
        // Atualizar elementos (se existirem)
        document.querySelectorAll('.community-stats .stat').forEach((stat, index) => {
            const values = Object.values(stats);
            if (values[index]) {
                stat.textContent = values[index];
            }
        });
    }
};

// Atualizar stats a cada 30 segundos
setInterval(() => {
    NavigationUtils.updateCommunityStats();
}, 30000);