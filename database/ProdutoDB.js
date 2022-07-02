const crypto = require('crypto');
const AWS = require('aws-sdk');
const { AwsConfig } = require('../config/Credenciais');

const tableName = "Produtos";
AWS.config.update(AwsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function salvar(bodyRequest) {
    bodyRequest.id = crypto.randomBytes(32).toString('hex');
    bodyRequest.ativo = true;
    bodyRequest.dataCadastro = new Date().toString();

    var params = {
        TableName: tableName,
        Item: bodyRequest
    };

    try {
        await dynamodb.put(params).promise();
        return bodyRequest;
    }catch(err) {
        console.log('err', err)
        return null;
    }
}

async function remover(id){
    var params ={
        TableName: tableName,
        Key: {
            id: id
        }
    }

    try{
        await dynamodb.delete(params).promise();
        return true;
    }catch(err) {
        console.log('err', err)
        return null;
    }
}

async function alterar(produto){
    var params = {
        TableName: tableName,
        Key: {id: produto.id},
        UpdateExpression: "set nome = :nome, descricao = :descricao, categoria = :categoria",
        ExpressionAttributeValues: {
            ":nome": produto.nome,
            ":descricao": produto.descricao,
            ":categoria": produto.categoria
        },
        ReturnValues: "UPDATED_NEW"
    };

    try{
        const dados = await dynamodb.update(params).promise();
        return dados;
    }catch(err){
        console.log('err', err)
    }
}

async function buscaPorCategoria(categoria){
    var params = {
        TableName: tableName,
        FilterExpression: "categoria = :categoria",
        ExpressionAttributeValues: {
            ":categoria": categoria
        }
    }

    try{
        const dados = await dynamodb.scan(params).promise();
        return dados.Items;
    }catch(err){
        console.log('err', err);
        return null;
    }
}

module.exports = {
    salvar,
    remover,
    alterar,
    buscaPorCategoria
}