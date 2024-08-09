import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

export const createObjeto = async (req, res) => {
    const { nome, peso, cor, descricao } = req.body;
    const disponivel = 1;

    if (!nome || nome.length < 3) {
    return res.status(400).json("O nome objeto é obrigatorio");
    }
    if (!peso) {
    return res.status(400).json("O peso objeto é obrigatorio");
    }
    if (!cor) {
    return res.status(400).json("A cor objeto é obrigatorio");
    }
    if (!descricao) {
    return res.status(400).json("A descricao objeto é obrigatorio");
}

    const objeto_id = uuidv4();
    const usuario_id = user.usuario_id;
    const insertSql = /*sql*/ `INSERT INTO objetos (??, ??, ??, ??, ??, ??, ?? ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const insertData = [
    "objeto_id",
    "nome",
    "peso",
    "cor",
    "descricao",
    "disponivel",
    "usuario_id",
    objeto_id,
    nome,
    peso,
    cor,
    descricao,
    disponivel,
    usuario_id,
];
    conn.query(insertSql, insertData, (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json("Erro ao cadastrar objeto");
    }
    if (req.files) {
      //cadastrar no banco
        const insertimagemSql = /*sql*/ `INSERT INTO objetos_images (image_id, objeto_id, image_path) VALUES ?`;
        const imageValues = req.files.map((file) => [uuidv4(), objeto_id]);
        conn.query(insertimagemSql, [imageValues], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json("Erro ao salvar a imagem do objeto");
        }
        res.status(201).json("Objeto cadastrado com sucesso");
    });
    } else {
        return res.status(201).json("Objeto cadastrado com sucesso");
    }
});
};
export const getAllObjetosUsuario = async (req, res) => {
try {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const usuario_id = user.usuario_id;
    const selectSql = /*sql*/ `
            SELECT
            obj.objeto_id,
            obj.usuario_id,
            obj.nome,
            obj.peso,
            obj.cor,
            obj.descricao GROUP_CONCAT
            (obj.img.image_path SEPARATOR ',') AS image_path
            FROM objetos AS obj 
            LEFT JOIN objetos_images
            AS obj_img ON obj.objeto_id = obj_img.objeto_id 
            WHERE obj.usuario_id =?
            GROUP BY obj.objeto_id, obj.usuario_id, obj.nome, obj.peso, obj.cor, obj.descricao`;

    conn.query(selectSql, [usuario_id], (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json("Erro ao buscar objeto");
    }
    const objetosUsuario = data.map((objeto) => ({
        objeto_id: objeto.objeto_id,
        usuario_id: objeto.usuario_id,
        nome: objeto.nome,
        peso: objeto.peso,
        cor: objeto.cor,
        descricao: objeto.descricao,
        image_paths: objeto.image_path.split(','),
    }));
        res.status(200).json(objetosUsuario);
    });
} catch (err) {
    console.error(err);
    res.status(500).json("Erro ao buscar objetos");
}
};

export const getObjetoByID = (req, res) => {
    const { id } = req.params;

    const checkSql = `SELECT objeto_id, nome, peso, cor, descricao FROM objeto WHERE objeto_id = ?`;
    const checkData = [id];

    conn.query(checkSql, checkData, (err, data) => {
        if (err) {
            console.error("Erro ao buscar o objeto:", err);
            return res.status(500).json({ msg: "Erro ao buscar o objeto" });
        }
        if (data.length === 0) {
            return res.status(404).json({ msg: "Objeto não encontrado" });
        }

        const objeto = data[0];
        res.status(200).json(objeto);
    });
}; 

