import jwt from 'jsonwebtoken';
import conn from '../config/conn.js';

const getUserByToken = async (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject({ status: 401, message: 'Acesso negado' });
        }

        try {
            // Decodificar o token sem verificar a assinatura
            const decoded = jwt.decode(token, 'SENHASUPERSEGURAEDIFICIL');
            if (!decoded || !decoded.id) {
                return reject({ status: 401, message: 'Token inválido ou sem ID' });
            }

            const userID = decoded.id;
            console.log('ID do usuário:', userID);

            const checkSql = 'SELECT * FROM usuario WHERE usuario_id = ?';
            const checkData = [userID];
            console.log('checkData do usuário:', checkData);
            conn.query(checkSql, checkData, (err, data) => {
                if (err) {
                    reject({ status: 500, message: 'Erro ao buscar usuário', error: err });
                } 
                if (data.length === 0) {
                    reject({ status: 404, message: 'Usuário não encontrado' });
                }
                
                resolve(data[0]);
            });
        } catch (error) {
            reject({ status: 500, message: 'Erro ao decodificar token', error });
        }
    });
};

export default getUserByToken;
