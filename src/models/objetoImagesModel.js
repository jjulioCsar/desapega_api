import conn from '../config/conn.js';

// SQL para criar a tabela objetos_images
const tableObjetosImagens = /*sql*/ `
CREATE TABLE IF NOT EXISTS objetos_images (
    image_id VARCHAR(60) PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    objeto_id VARCHAR(60),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (objeto_id) REFERENCES objetos(objeto_id)
)`;

conn.query(tableObjetosImagens, (err) => {
    if (err) {
        console.error("Erro ao criar a tabela: " + err);
        return;
    }
    console.log("Tabela [objetos_images] criada com sucesso!");
});
