const express =require('express');
const router = express.Router();
const { validarJwt } = require('../util/jwt');
const { salvar, remover, alterar, buscaPorCategoria} = require('../database/ProdutoDB');


router.post('/', validarJwt, async(req, res) => {
    if(validarRequestProduto(req)){
        const cadastro = await salvar(req.body);
        return res.send(cadastro);
    }

    return res.status(500).json({messagem : "Produto não cadastrado"})
});

router.delete('/', validarJwt, async(req, res) => {
    if(req.body.id){
        const sucesso = await remover(req.body.id);
        return res.send({sucesso: sucesso});
    }

    return res.status(404).json({messagem :"Produto não encontrado"})
});

router.put('/', validarJwt, async(req, res) => {
    if(validarRequestProduto(req) && req.body.id) {
        const dados = await alterar(req.body);
        return res.json(dados);
    }

    return res.status(404).json({mensagem: "Produto não encontrado"})
});

router.get('/buscaPorCategoria', validarJwt, async(req, res) => {
    if(!req.body.categoria) {
        return res.status(404).json({messagem : "Digite a categoria"})
    }

    const dados = await buscaPorCategoria(req.body.categoria);
    if(dados){
        return res.send(dados);
    }

    return res.status(404).json({message : "Produto não encontrado"})
})


function validarRequestProduto(request) {
    return request.body && request.body.nome && request.body.descricao && request.body.categoria;
}

module.exports = router;