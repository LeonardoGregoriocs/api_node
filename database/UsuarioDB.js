const crypto = require('crypto');
const AWS = require("aws-sdk");
const { encrypt, getSenhaDecrypt } = require('../util/crypto');
const { AwsConfig } = require('../config/Credenciais');

const tableName = "Usuario";
AWS.config.update(AwsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function salvar(bodyRequest){
    const senhaEncrypt = encrypt(bodyRequest.senha);

    bodyRequest.id = crypto.randomBytes(32).toString('hex');
    bodyRequest.ativo = true;
    bodyRequest.dataCadastro = new Date().toString();
    bodyRequest.senha = senhaEncrypt;

    var params = {
        TableName: tableName,
        Item: bodyRequest
    };

    try {
        await dynamodb.put(params).promise();
        return bodyRequest;
    }catch (err){
        console.log('err', err);
        return null;
    }
}

async function remover(id, email) {
    var params = {
        TableName: tableName,
        Key: {
            id: id,
            email: email
        }
    }

    try {
        await dynamodb.delete(params).promise();
        return true;
    }catch(err) {
        console.log('err', err);
        return null;
    }
}

async function alterar(usuario) {
    var params = {
        TableName: tableName,
        Key: {"id": usuario.id, "email": usuario.email},
        UpdateExpression: "set nome = :nome",
        ExpressionAttributeValues: {
            ":nome": usuario.nome,
        },

        ReturnValues: "UPDATED_NEW"
    };

    try{
        const dados = dynamodb.update(params).promise();
        return dados
    }catch(err) {
        console.log('err', err);
        return null;
    }
}

async function buscaPorEmailSenha(email, senha) {
    try{
        var params = {
            TableName: tableName,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const dados = await dynamodb.scan(params).promise();

        if(dados && dados.Items) {
            const usuario = dados.Items[0];
            const senhaDecrypt = getSenhaDecrypt(usuario.senha);

            return (senha === senhaDecrypt) ? usuario : null
        }

        return null;

    }catch(err){
        return null;
    }
}

// async function buscaPorEmail(email) {
//     try{
//         var params = {
//             TableName: tableName,
//             FilterExpression: "email = :email",
//             ExpressionAttributeValues: {
//                 ":email": email
//             }
//         }

//         const dados = await dynamodb.scan(params).promise();

//         return dados.Items[0];

//     }catch(err) {
//         console.log('err', err);
//         return null;
//     }
// }

module.exports = {
    salvar,
    remover,
    alterar,
    buscaPorEmailSenha
}