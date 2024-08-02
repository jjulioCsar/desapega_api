import "dotenv/config";
import express from "express";

// Configurações de porta
const PORT = process.env.PORT || 3000;


// Importar conexão com o banco de dados
import conn from './config/conn.js';

// Importar modelos
import "./models/usuarioModel.js";

// Importar rotas
import usuarioRouter from './routes/usuarioRouter.js';

// Formatação das rotas
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas ativas
app.use('/users', usuarioRouter);

// Tratamento de erro 404 - Página não encontrada
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Rodar o servidor
app.listen(PORT, () => {
    console.log(`Rodando o servidor na porta: ${PORT}`);
});
