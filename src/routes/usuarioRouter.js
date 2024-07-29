import { Router } from 'express';

// Helper para validar os dados do novo usuário
import validarUsuario from '../helpers/validar-user.js';
// Importar o controller para registrar o novo usuário
import { register } from '../controllers/usuarioController.js'; 

const router = Router();
router.post('/register', validarUsuario, register);

export default router;
