const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../FrontEnd'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Configuração do MySQL - COM SUAS CREDENCIAIS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // SUA SENHA
    database: 'noiscode_db' // SEU BANCO
});

// Conectar ao banco
db.connect((err) => {
    if (err) {
        console.log('❌ Erro na conexão com MySQL:', err.message);
        console.log('💡 Verifique se:');
        console.log('   - MySQL está rodando');
        console.log('   - Banco "noiscode_db" existe');
        console.log('   - Usuário root tem senha 123456');
        return;
    }
    console.log('✅ Conectado ao MySQL com sucesso!');
    console.log('📊 Banco: noiscode_db');
    
    // Criar tabela se não existir
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.log('❌ Erro ao criar tabela:', err);
        } else {
            console.log('✅ Tabela usuarios verificada/criada');
        }
    });
});

// Rotas da API
app.post('/api/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    
    console.log('📝 Tentativa de cadastro:', { nome, email });
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) {
            console.log('❌ Erro no cadastro:', err.code);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Email já cadastrado" });
            }
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
        console.log('✅ Usuário cadastrado com sucesso! ID:', result.insertId);
        return res.json({ message: "Usuário cadastrado com sucesso!" });
    });
});

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    
    console.log('🔐 Tentativa de login:', { email });
    
    const sql = "SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?";
    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.log('❌ Erro no login:', err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        
        if (results.length > 0) {
            const user = results[0];
            console.log('✅ Login bem-sucedido para:', user.email);
            return res.json({ 
                message: "Login realizado com sucesso!", 
                user: { id: user.id, nome: user.nome, email: user.email } 
            });
        } else {
            console.log('❌ Login falhou para:', email);
            return res.status(401).json({ error: "Email ou senha incorretos" });
        }
    });
});

// Rota para listar usuários (APENAS PARA TESTE)
app.get('/api/usuarios', (req, res) => {
    const sql = "SELECT id, nome, email, created_at FROM usuarios ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.log('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
        res.json({ usuarios: results });
    });
});

// Rota para verificar status
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Servidor rodando', 
        database: 'Conectado', 
        timestamp: new Date(),
        port: 3001
    });
});

// Servir arquivos estáticos - ROTAS PARA PÁGINAS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/cadastro.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/Dashboard.html'));
});

// Rota para testar CSS
app.get('/test-css', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/test-css.html'));
});

// Rota para servir qualquer arquivo estático que não foi encontrado
app.get('*', (req, res) => {
    if (req.path.includes('.')) {
        // Se tem extensão, tenta servir o arquivo
        res.sendFile(path.join(__dirname, '../FrontEnd', req.path));
    } else {
        // Se não, redireciona para index
        res.sendFile(path.join(__dirname, '../FrontEnd/index.html'));
    }
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error('❌ Erro no servidor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📧 Acesse: http://localhost:${PORT}`);
    console.log(`✅ API: http://localhost:${PORT}/api`);
    console.log(`🎨 Teste CSS: http://localhost:${PORT}/test-css`);
    console.log('');
    console.log('📋 Rotas disponíveis:');
    console.log('   GET  /              - Página inicial');
    console.log('   GET  /login         - Página de login');
    console.log('   GET  /cadastro      - Página de cadastro');
    console.log('   GET  /dashboard     - Dashboard');
    console.log('   POST /api/cadastro  - Cadastrar usuário');
    console.log('   POST /api/login     - Fazer login');
    console.log('   GET  /api/usuarios  - Listar usuários (TESTE)');
    console.log('   GET  /api/status    - Status do servidor');
    console.log('');
    console.log('🔧 Configuração MySQL:');
    console.log('   Host: localhost');
    console.log('   User: root');
    console.log('   Database: noiscode_db');
    console.log('========================================');
});