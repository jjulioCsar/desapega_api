import "dotenv/config";
import express from "express";
import path from 'path';
import { fileURLToPath } from "url";

// Configurações de porta
const PORT = process.env.PORT || 3000;


// Importar conexão com o banco de dados
import conn from './config/conn.js';

// Importar modelos
import "./models/usuarioModel.js";
import "./models/objetoModel.js";
import "./models/objetoImagesModel.js";
// Importar rotas
import usuarioRouter from './routes/usuarioRouter.js';
import objetosRouter from './routes/objetosRoute.js';

// Formatação das rotas
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, 'public')));

// Rotas ativas
app.use('/users', usuarioRouter);
app.use('/objetos', objetosRouter);

// Tratamento de erro 404 - Página não encontrada
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Rodar o servidor
app.listen(PORT, () => {
    console.log(`Rodando o servidor na porta: ${PORT}`);
});
