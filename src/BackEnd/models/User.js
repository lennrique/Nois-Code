
const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Criar usuário
    static async create(userData) {
        const sql = `
            INSERT INTO usuarios (nome, email, senha, avatar_url, bio)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            userData.nome,
            userData.email,
            userData.senha,
            userData.avatar_url || null,
            userData.bio || null
        ];
        
        const result = await query(sql, params);
        return result.insertId;
    }

    // Buscar usuário por email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE';
        const results = await query(sql, [email]);
        return results[0];
    }

    // Buscar usuário por ID
    static async findById(id) {
        const sql = 'SELECT id, nome, email, avatar_url, bio, github_url, linkedin_url, data_criacao FROM usuarios WHERE id = ? AND ativo = TRUE';
        const results = await query(sql, [id]);
        return results[0];
    }

    // Verificar se email existe
    static async emailExists(email) {
        const sql = 'SELECT id FROM usuarios WHERE email = ?';
        const results = await query(sql, [email]);
        return results.length > 0;
    }
}

module.exports = User;