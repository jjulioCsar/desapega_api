import jwt from "jsonwebtoken";
import getToken from "./get-token.js";

const verifyToken = (req, res, next) => {
    // Verificar se há um cabeçalho de autorização
    if (!req.headers.authorization) {
        res.status(401).json({ err: "Acesso negado" });
        return;
    }

    // Obter o token do cabeçalho de autorização
    const token = getToken(req);
    if (!token) {
        res.status(401).json({ err: "Acesso negado" });
        return;
    }

    try {
        // Decodificar o token (sem verificar a assinatura)
        const decoded = jwt.decode(token, "SENHASUPERSEGURAEDIFICIL");

        if (!decoded) {
            res.status(400).json({ err: "Token inválido" });
            return;
        }

        // Anexar as informações do usuário ao objeto da requisição
        req.usuario = decoded;

        // Prosseguir para o próximo middleware ou rota
        next();
    } catch (error) {
        // Responder com erro se houver falha na decodificação do token
        res.status(400).json({ err: "Token inválido" });
    }
};

export default verifyToken;
