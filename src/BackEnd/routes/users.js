const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nois_code'
});

// Conectar ao banco
connection.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar no banco:', err);
    } else {
        console.log('✅ Conectado ao banco MySQL!');
    }
});

// Rota para listar todos os usuários
router.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// Rota para buscar usuário por ID
router.get('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
    
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.json(results[0]);
    });
});

// Rota para criar novo usuário
router.post('/usuarios', (req, res) => {
    const { nome, email, senha, localizacao, stack_principal } = req.body;
    
    const sql = 'INSERT INTO usuarios (nome, email, senha, localizacao, stack_principal) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(sql, [nome, email, senha, localizacao, stack_principal], (err, results) => {
        if (err) {
            console.error('Erro ao criar usuário:', err);
            return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
        
        res.json({ 
            message: 'Usuário criado com sucesso!',
            id: results.insertId 
        });
    });
});

module.exports = router;