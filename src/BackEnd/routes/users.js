
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// REGISTRAR USUÁRIO
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Validar campos obrigatórios
        if (!nome || !email || !senha) {
            return res.status(400).json({ 
                success: false,
                error: 'Nome, email e senha são obrigatórios' 
            });
        }

        // Verificar se email já existe
        const emailExists = await User.emailExists(email);
        if (emailExists) {
            return res.status(400).json({ 
                success: false,
                error: 'Email já cadastrado' 
            });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar usuário
        const userId = await User.create({
            nome,
            email,
            senha: hashedPassword
        });

        res.status(201).json({ 
            success: true,
            message: 'Usuário criado com sucesso!',
            userId 
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor' 
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validar campos
        if (!email || !senha) {
            return res.status(400).json({ 
                success: false,
                error: 'Email e senha são obrigatórios' 
            });
        }

        // Buscar usuário
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Credenciais inválidas' 
            });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false,
                error: 'Credenciais inválidas' 
            });
        }

        // Retornar dados do usuário (sem senha)
        const userResponse = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
            data_criacao: user.data_criacao
        };

        res.json({ 
            success: true,
            message: 'Login realizado com sucesso!',
            user: userResponse 
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor' 
        });
    }
});

// BUSCAR USUÁRIO POR ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'Usuário não encontrado' 
            });
        }
        
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor' 
        });
    }
});

module.exports = router;