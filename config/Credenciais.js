require('dotenv').config()

module.exports={
    AwsConfig: {
        "region": "us-east-1",
        "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
        "accessKeyId": process.env.SECRET_KEY,
        "secretAccessKey": process.env.SECRET_ACCESS_KEY
    }
}