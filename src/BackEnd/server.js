const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');

// Configuração do banco (USE A MESMA DO SEU database.js)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // senha vazia para XAMPP
    database: 'nois_code'
});

// ✅ ROTA DE CADASTRO
router.post('/cadastrar', (req, res) => {
    console.log('📝 Recebendo dados de cadastro:', req.body);
    
    const { nome, email, senha, localizacao, stack_principal } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Nome, email e senha são obrigatórios!'
        });
    }

    const sql = `INSERT INTO usuarios (nome, email, senha, localizacao, stack_principal) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    connection.query(sql, [nome, email, senha, localizacao || '', stack_principal || ''], (err, results) => {
        if (err) {
            console.error('❌ Erro no cadastro:', err);
            
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Este email já está cadastrado!'
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor'
            });
        }
        
        console.log('✅ Usuário cadastrado com ID:', results.insertId);
        res.json({
            success: true,
            message: 'Usuário cadastrado com sucesso!',
            userId: results.insertId
        });
    });
});

// ✅ ROTA DE LOGIN
router.post('/login', (req, res) => {
    console.log('🔐 Recebendo tentativa de login:', req.body);
    
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Email e senha são obrigatórios!'
        });
    }

    const sql = 'SELECT id, nome, email, localizacao, stack_principal FROM usuarios WHERE email = ? AND senha = ?';
    
    connection.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error('❌ Erro no login:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor'
            });
        }
        
        if (results.length > 0) {
            const usuario = results[0];
            console.log('✅ Login bem-sucedido para:', usuario.nome);
            
            res.json({
                success: true,
                message: 'Login realizado com sucesso!',
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    localizacao: usuario.localizacao,
                    stack: usuario.stack_principal
                }
            });
        } else {
            console.log('❌ Login falhou para:', email);
            res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos!'
            });
        }
    });
});

// ✅ ROTA PARA LISTAR USUÁRIOS (teste)
router.get('/', (req, res) => {
    connection.query('SELECT id, nome, email, localizacao, stack_principal FROM usuarios', (err, results) => {
        if (err) {
            console.error('❌ Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

module.exports = router;