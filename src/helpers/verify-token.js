import jwt from "jsonwebtoken"
import getToken from "./get-token.js"

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization){
        res.status(401).json({err: "Acesso negado"})
        return
    }

    const token = getToken(req)
    if(!token){
        res.status(401).json({err : "Acesso negado"})
        return;
    }
}