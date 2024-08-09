import { Router } from "express";
import { createObjeto, getAllObjetosUsuario, getObjetoByID } from "../controllers/objetoController.js";


//helpers
import verifyToken from "../helpers/verify-token.js";
import imagemUploader from "../helpers/image-upload.js";


const router = Router();
// Definir a rota para criar um objeto
router.post("/create", verifyToken, imagemUploader.array("imagens", 10), createObjeto);
//listar o objeto por id
router.get("/:id", verifyToken, getObjetoByID);
//rota para listar todos os objetos de um usuario
router.get("/allobjetos",  getAllObjetosUsuario);
//rota para upload de imagens
router.get("/usuarios/imagens", )

export default router;
