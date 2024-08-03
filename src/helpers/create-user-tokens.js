import jwt from 'jsonwebtoken';

// Função assíncrona para assinar um token JWT
const createUserToken = async (usuario, req, res) => {
    try {
        // Criar um token JWT
        const token = jwt.sign(
            {
                id: usuario.usuario_id, // ID do usuário
                nome: usuario.nome,     // Nome do usuário
            },
            'SENHASEGURAEDIFICIL', // Substitua pela sua senha secreta
            { expiresIn: '1h' }     // Tempo de expiração do token (opcional)
        );

        // Retornar o token JWT para o cliente
        res.status(200).json({
            token: token,
            msg: 'Você está logado!',
            usuarioID: usuario.usuario_id,
        });
    } catch (error) {
        console.error('Erro ao criar token:', error);
        res.status(500).json({ msg: 'Erro ao criar token' });
    }
};

export default createUserToken;
