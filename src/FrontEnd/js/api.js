// Configuração da API - PORTA 3001
const API_BASE_URL = 'http://localhost:3001/api';

// Função para fazer requisições API
async function makeRequest(endpoint, method = 'GET', data = null) {
    try {
        console.log(`Fazendo requisição para: ${API_BASE_URL}${endpoint}`);
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        console.log('Resposta da API:', result);
        
        return {
            success: response.ok,
            data: result,
            status: response.status
        };
    } catch (error) {
        console.error('Erro na requisição:', error);
        return {
            success: false,
            error: 'Erro de conexão com o servidor. Verifique se o servidor está rodando.'
        };
    }
}

// Funções específicas da API
export const api = {
    // Cadastro
    async cadastrarUsuario(usuarioData) {
        return await makeRequest('/cadastro', 'POST', usuarioData);
    },

    // Login
    async loginUsuario(loginData) {
        return await makeRequest('/login', 'POST', loginData);
    },

    // Verificar status do servidor
    async verificarStatus() {
        return await makeRequest('/status', 'GET');
    }
};

// Função para verificar se usuário está logado
export function isLoggedIn() {
    return localStorage.getItem('userToken') !== null;
}

// Função para fazer logout
export function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
}

// Verificar conexão com servidor
export async function verificarConexao() {
    try {
        const response = await api.verificarStatus();
        return response.success;
    } catch (error) {
        return false;
    }
}