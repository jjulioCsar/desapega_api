import bcrypt from "bcrypt";
import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";
import Jwt from "jsonwebtoken";

// Importar os Helpers
import createUserToken from "../helpers/create-user-tokens.js";
import getToken from "../helpers/get-token.js"; // Importando o helper para pegar o token

// Criar um novo usuário
export const register = async (req, res) => {
    const { nome, email, senha, telefone, confirmSenha } = req.body;

    // Verificar se o email já está cadastrado
    const checkEmailSQL = `SELECT * FROM usuario WHERE email = ?`;
    const checkEmailDATA = [email];

    conn.query(checkEmailSQL, checkEmailDATA, async (err, data) => {
        if (err) {
            console.error("Erro ao verificar email:", err);
            return res.status(500).json({ msg: "Erro ao verificar email" });
        }

        if (data.length > 0) {
            return res.status(409).json({ msg: "Email já cadastrado" });
        }

        try {
            // Criar a senha do usuário
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(senha, salt);
            console.log("Senha criada:", hashedPassword);

            // Cadastrar usuário
            const id = uuidv4();
            const imagem = "user_default.png";
            const insertUserSQL = `INSERT INTO usuario (usuario_id, nome, email, senha, telefone, imagem) VALUES (?, ?, ?, ?, ?, ?)`;
            const insertUserValues = [id, nome, email, hashedPassword, telefone, imagem];

            conn.query(insertUserSQL, insertUserValues, (err) => {
                if (err) {
                    console.error("Erro ao cadastrar usuário:", err);
                    return res.status(500).json({ msg: "Erro ao cadastrar usuário" });
                }

                // Buscar o novo usuário
                const usuarioSql = `SELECT * FROM usuario WHERE usuario_id = ?`;
                const usuarioData = [id];

                conn.query(usuarioSql, usuarioData, async (err, data) => {
                    if (err) {
                        console.error("Erro ao buscar o novo usuário:", err);
                        return res.status(500).json({ msg: "Erro ao buscar o novo usuário" });
                    }

                    const usuario = data[0];

                    try {
                        await createUserToken(usuario, req, res);
                    } catch (error) {
                        console.error("Erro ao gerar token:", error);
                        return res.status(500).json({ msg: "Erro ao gerar token" });
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao processar a senha:", error);
            return res.status(500).json({ msg: "Erro ao processar a senha" });
        }
    });
};

// Login do usuário
export const login = async (req, res) => {
    const { email, senha } = req.body;

    // Validações do login
    if (!email) {
        return res.status(400).json({ err: "O email é obrigatório" });
    }

    if (!senha) {
        return res.status(400).json({ err: "A senha é obrigatória" });
    }

    const checkSql = `SELECT * FROM usuario WHERE email = ?`;
    const checkData = [email];

    conn.query(checkSql, checkData, async (err, data) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);
            return res.status(500).json({ msg: "Erro ao buscar usuário" });
        }

        if (data.length === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        const user = data[0];

        // Verificar se a senha está correta/comparar a senha
        const compararSenha = await bcrypt.compare(senha, user.senha);

        if (!compararSenha) {
            return res.status(401).json({ msg: "Senha incorreta" });
        }

        try {
            await createUserToken(user, req, res);
        } catch (error) {
            console.error("Erro ao processar informação:", error);
            return res.status(500).json({ msg: "Erro ao processar informação" });
        }
    });
};

// Verificar usuário
export const checkUser = async (req, res) => {
    let usuarioAtual = null;

    if (req.headers.authorization) {
        try {
            const token = getToken(req); // Utilizando o helper para pegar o token
            const decoded = Jwt.decode(token, "SENHASEGURASUPERDIFICIL"); // Decodificar o token

            const usuarioID = decoded.id;

            const checkSql = `SELECT * FROM usuario WHERE usuario_id = ?`;
            const checkData = [usuarioID];
            
            conn.query(checkSql, checkData, (err, data) => {
                if (err) {
                    console.error("Erro ao verificar usuário:", err);
                    return res.status(500).json({ msg: "Erro ao verificar usuário" });
                }
                usuarioAtual = data[0];
                res.status(200).json({ usuario: usuarioAtual });
            });
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            res.status(500).json({ msg: "Erro ao verificar usuário" });
        }
    } else {
        res.status(200).json({ usuario: usuarioAtual });
    }
};

//Puxar usuario pelo id
export const getUserById = (req, res) => {
    const {id} = req.params

    const checkSql = /*sql*/ `
    select usuario_id, nome, email, telefone, imagem
    from usuario
    where ?? = ?
    `
    const checkData = ["usuario_id", id]
    conn.query(checkSql, checkData, (err, data)=>{
        if(err){
            console.error(err)
            res.status(500).json({err: "Erro ao buscar o usuario"})
            return
        }
        if(data.length === 0){
            res.status(404).json({err: "Usuario nao encontrado"})
            return
        }

        const usuario = data[0]
        res.status(200).json(usuario)
    })
}

//Editar usuario
export const editUser = (req, res) => {
    const {} = req.params

    //verificar se o usuario está logado
    const token = getToken(req)
    console.log(token)
    
}