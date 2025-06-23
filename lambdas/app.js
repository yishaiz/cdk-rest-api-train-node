const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME; // 'QuotesTable';

exports.handler = async (event, context) => {
  console.log('Event::::', JSON.stringify(event, null, 2));

  // TODO: get data from table - dynamo db

  return {
    statusCode: 200,
    body: JSON.stringify({
      quote: 'Hello my quote!',
    }),
  };
};
