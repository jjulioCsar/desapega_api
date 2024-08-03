import multer from 'multer';
import { fileURLToPath } from 'url'; // Corrigido import
import path from 'path';

// Corrigido para obter o __dirname e __filename corretamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento de imagens
const imagemStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "";

        // Determina o diretório de destino com base na URL
        if (req.baseUrl.includes('/usuario')) {
            folder = "usuario";
        } else if (req.baseUrl.includes('/objetos')) {
            folder = "objetos";
        }
        cb(null, path.join(__dirname, `../public/${folder}/`));
    },
    filename: (req, file, cb) => {
        // Gera um nome único para o arquivo
        cb(null, Date.now() + '-' + Math.floor(Math.random() * 100000) + path.extname(file.originalname));
    }
});

// Configuração do multer
const imagemUploader = multer({
    storage: imagemStorage,
    fileFilter: (req, file, cb) => {
        // Aceita apenas arquivos png e jpg
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Por favor, envie apenas arquivos jpg ou png!'));
        }
        cb(null, true);
    },
});

export default imagemUploader;
