const jwt = require('jsonwebtoken')
const SECRET = 'mysecret';
const TEMPO_EXPIRACAO = 600;

function gerarTokenJwt(id){
    return jwt.sign({id}, SECRET, {expiresIn: TEMPO_EXPIRACAO});
}

function validarJwt(req, res, next){
    const token = req.headers['x-access-token'];

    if(!token) {
        return res.status(401).json({auth: false, mensagem: "O token não foi fornecido"})
    }

    jwt.verify(token, SECRET, function(err, decoded){
        if(err){
            return res.status(500).json({auth: false, mensagem: "Falha para autenticar com o token"});
        }

        req.userId = decoded.id;
        next();
    });
}

module.exports = {
    validarJwt,
    gerarTokenJwt
}