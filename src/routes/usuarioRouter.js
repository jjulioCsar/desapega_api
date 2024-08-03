import { Router } from "express";

// Helper para validar os dados do novo usuário
import validarUsuario from "../helpers/validar-user.js";
import verifyToken from "../helpers/verify-token.js"
import imagemUploader from "../helpers/image-upload.js";

// Importar o controller para registrar o novo usuário
import {
    register,
    login,
    checkUser,
    getUserById,
    editUser
} from "../controllers/usuarioController.js";

// Definir as rotas para registrar e logar o novo usuário
const router = Router();
router.post("/register", validarUsuario, register);
router.post("/login", login);
router.get("/checkUser", checkUser); //Serve para auxiliar o front end
router.get("/:id", getUserById)
router.put("/edit/:id", verifyToken, imagemUploader.single("imagem"), editUser) // Verificar se está logado e upload de imagem para perfil

export default router;
