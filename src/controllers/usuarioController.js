import bcrypt from "bcrypt";
import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// Importar os Helpers
import createUserToken from "../helpers/create-user-tokens.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

// Função para validar dados do usuário
const validateUserInput = (nome, email, telefone) => {
  if (nome && nome.length < 3) {
    return "Nome deve ter pelo menos 3 caracteres.";
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return "Email inválido.";
  }
  if (telefone && !/^\d+$/.test(telefone)) {
    return "Telefone deve conter apenas números.";
  }
  return null;
};

// Criar um novo usuário
export const register = async (req, res) => {
  const { nome, email, senha, telefone, confirmsenha } = req.body;

  // Verificar se as senhas coincidem
  if (senha !== confirmsenha) {
    return res.status(400).json({ msg: "As senhas não coincidem" });
  }

  // Validar os dados do usuário
  const validationError = validateUserInput(nome, email, telefone);
  if (validationError) {
    return res.status(400).json({ msg: validationError });
  }

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

      // Cadastrar usuário
      const id = uuidv4();
      const imagem = "user_default.png";
      const insertUserSQL = `INSERT INTO usuario (usuario_id, nome, email, senha, telefone, imagem) VALUES (?, ?, ?, ?, ?, ?)`;
      const insertUserValues = [
        id,
        nome,
        email,
        hashedPassword,
        telefone,
        imagem,
      ];

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
            return res
              .status(500)
              .json({ msg: "Erro ao buscar o novo usuário" });
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
      const decoded = jwt.decode(token, "SENHASEGURASUPERDIFICIL"); // Decodificar o token

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

// Puxar usuário pelo id
// Exemplo de verificação de usuário pelo ID (para funções como getUserById)
export const getUserById = (req, res) => {
  const { id } = req.params;

  console.log("Buscando usuário com ID:", id); // Log para verificar o ID

  const checkSql = `SELECT usuario_id, nome, email, telefone, imagem FROM usuario WHERE usuario_id = ?`;
  const checkData = [id];

  conn.query(checkSql, checkData, (err, data) => {
    if (err) {
      console.error("Erro ao buscar o usuário:", err);
      return res.status(500).json({ msg: "Erro ao buscar o usuário" });
    }

    if (data.length === 0) {
      console.log("Usuário não encontrado com ID:", id); // Log para verificar se o usuário foi encontrado
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const usuario = data[0];
    res.status(200).json(usuario);
  });
};

// Editar usuário
export const editUser = async (req, res) => {
    const { id } = req.params;
    console.log("User ID from params:", id);
  
    try {
      const token = getToken(req);
      console.log("Token:", token);
      
      let user;
      try {
        user = await getUserByToken(token);
        console.log("User from token:", user);
      } catch (error) {
        console.error("Erro ao obter usuário pelo token:", error);
        return res.status(401).json({ msg: "Erro ao obter usuário pelo token" });
      }
  
      // Verifique se o ID do usuário da URL e o ID do token são os mesmos

      console.log("User ID from request:", id);
      console.log("User ID from request:", user.usuario_id);
      if (user.usuario_id != id) {
        return res.status(403).json({ msg: "Acesso não autorizado" });
      }
  
      const { nome, email, telefone } = req.body;
      console.log("Request body:", req.body);
      let imagem = user.imagem;
  
      if (req.file) {
        imagem = req.file.filename;
        console.log("Imagem atualizada:", imagem);
      }
  
      const checkSql = `SELECT * FROM usuario WHERE usuario_id = ?`;
      const checkData = [id];
  
      conn.query(checkSql, checkData, (err, data) => {
        if (err) {
          console.error("Erro ao buscar usuário:", err);
          return res.status(500).json({ err: "Erro ao buscar usuário" });
        }
  
        if (data.length === 0) {
          return res.status(404).json({ msg: "Usuário não encontrado" });
        }
  
        const updateSql = `UPDATE usuario SET nome = ?, email = ?, telefone = ?, imagem = ? WHERE usuario_id = ?`;
        const updateData = [nome, email, telefone, imagem, id];
  
        conn.query(updateSql, updateData, (err) => {
          if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json({ err: "Erro ao atualizar usuário" });
          }
          res.status(200).json({ message: "Usuário atualizado com sucesso" });
        });
      });
    } catch (error) {
      console.error("Erro ao processar informação:", error);
      res.status(500).json({ message: "Erro ao processar informação" });
    }
  };

// Remover usuário
export const removeUser = (req, res) => {
  const { id } = req.params;

  const checkSql = `SELECT * FROM usuario WHERE usuario_id = ?`;
  const checkData = [id];

  conn.query(checkSql, checkData, (err, data) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ message: "Erro ao buscar usuário" });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const deleteSql = `DELETE FROM usuario WHERE usuario_id = ?`;
    const deleteData = [id];

    conn.query(deleteSql, deleteData, (err) => {
      if (err) {
        console.error("Erro ao remover usuário:", err);
        return res.status(500).json({ message: "Erro ao remover usuário" });
      }

      res.status(200).json({ message: "Usuário removido com sucesso" });
    });
  });
};
