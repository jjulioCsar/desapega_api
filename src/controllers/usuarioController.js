import bcrypt from 'bcrypt';
import conn from '../config/conn.js';
import { v4 as uuidv4 } from 'uuid'; 

export const register = async (req, res) => {
    const { nome, email, senha, telefone, confirmSenha} = req.body;

    // Verificar se o email já está cadastrado
    const checkEmailSQL = /*sql*/ `SELECT * FROM usuario WHERE email = ?`;
    const checkEmailDATA = [email];

    conn.query(checkEmailSQL, checkEmailDATA, async (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Erro ao verificar email" });
            return;
        }
        if (data.length > 0) {
            res.status(409).json({ msg: "Email já cadastrado" });
            return;
        }

        try {
            // Criar a senha do usuário
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(senha, salt);
            console.log("Senha criada: " + hashedPassword);

            // Cadastrar usuário
            const id = uuidv4(); 
            const imagem = 'user_default.png'; 
            const insertUserSQL = /*sql*/ `INSERT INTO usuario (usuario_id, nome,  email, senha, telefone, imagem) VALUES (?, ?, ?, ?, ?, ?)`;
            const insertUserValues = [id, nome, email, hashedPassword, telefone, imagem];

            conn.query(insertUserSQL, insertUserValues, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ msg: "Erro ao cadastrar usuário" });
                    return;
                }
                res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao processar a senha" });
        }
    });
};
