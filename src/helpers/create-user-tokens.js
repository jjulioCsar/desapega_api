import jwt from "jsonwebtoken"

//function assicrona para assinar um token JWT
const createUserToken = async (usuario, req, res) => {
    //Criar um token JWT
    const token = jwt.sign( // O payload do token
        {
            id: usuario.usuario_id, // ID do usuário
            nome: usuario.nome, // Nome do usuário
            
        },
        "SENHASEGURAEDIFICIL" // Substituir "SENHASEGURAEDIFICIL" com a sua própria senha secreta
    )
    //Retornando o token JWT para o cliente
    res.status(200).json({
        token: token,
        msg: "Você esta logado!",
        usuarioID: usuario.usuario_id
    })
}

export default createUserToken;