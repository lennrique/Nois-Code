const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'noiscode_user',
    password: process.env.DB_PASSWORD || 'senha_segura_123',
    database: process.env.DB_NAME || 'noiscode_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Testar conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao MySQL com sucesso!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com MySQL:', error.message);
        return false;
    }
}

// Executar query
async function query(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Erro na query:', error);
        throw error;
    }
}

module.exports = {
    pool,
    query,
    testConnection
};