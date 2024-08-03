import conn from '../config/conn.js';

// SQL para criar a tabela objetos
const tableObjetos = /*sql*/ `
CREATE TABLE IF NOT EXISTS objetos (
    objeto_id VARCHAR(60) PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    peso VARCHAR(100) NOT NULL,
    cor VARCHAR(255) NOT NULL,
    descricao TEXT,
    disponivel BOOLEAN,
    usuario_id VARCHAR(60),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
)`;

conn.query(tableObjetos, (err) => {
    if (err) {
        console.error("Erro ao criar a tabela: " + err);
        return;
    }
    console.log("Tabela [objetos] criada com sucesso!");
});
