import { Router } from "express";
import { createObjeto } from "../controllers/objetoController.js";

//helpers
import verifyToken from "../helpers/verify-token.js";
import imagemUploader from "../helpers/image-upload.js";


const router = Router();
// Definir a rota para criar um objeto
router.post("/create", verifyToken, imagemUploader.array("imagens", 10), createObjeto);
//listar todos os objetos
//listar todas as imagens de um objeto
//listar todas as imagens que pertencem a um usuario
router.get("/usuarios/imagens", )

export default router;
