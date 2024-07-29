import conn from '../config/conn.js';

const tableUsuario = /*sql*/ `
CREATE TABLE IF NOT EXISTS usuario (
    usuario_id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

conn.query(tableUsuario, (err) => {
    if (err) {
        console.error("Erro ao criar a tabela: " + err);
        return;
    }
    console.log("Tabela [usuario] criada com sucesso!");
});
