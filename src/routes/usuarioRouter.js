import { Router } from "express";

import { register } from "../controllers/usuarioController.js";

const router = Router();
router.post('/register', register)

export default router;