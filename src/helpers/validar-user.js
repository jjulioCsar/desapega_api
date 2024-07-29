const validarUsuario = (req, res, next) => {
    // Validação de Campos Obrigatórios
    const { nome, email, telefone, senha, confirmsenha } = req.body;
    if (!nome) {
        res.status(400).json({ msg: "O nome é obrigatório" });
        return;
    }
    if (!email) {
        res.status(400).json({ msg: "O email é obrigatório" });
        return;
    }
    if (!telefone) {
        res.status(400).json({ msg: "O telefone é obrigatório" });
        return;
    }
    if (!senha) {
        res.status(400).json({ msg: "A senha é obrigatória" });
        return;
    }
    if (!confirmsenha) {
        res.status(400).json({ msg: "A confirmação da senha é obrigatória" });
        return;
    }

    // Validação de Campos de Email e Senha
    if (!email.includes('@')) {
        res.status(409).json({ msg: "O email está em formato inválido" });
        return;
    }
    if (senha.length < 8) {
        res.status(400).json({ msg: "A senha deve ter pelo menos 8 caracteres" });
        return;
    }
    if (senha !== confirmsenha) {
        res.status(400).json({ msg: "A senha e a confirmação da senha devem ser iguais" });
        return;
    }

    next();
};

export default validarUsuario;
