const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log('Event::::', JSON.stringify(event, null, 2));

  return sendResponse(
    200,
    JSON.stringify({ message: 'Hello from the Lambda function!', TABLE_NAME })
  );
};

const sendResponse = (status, body) => {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
};

/*
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      throw new Error('Missing id parameter');
    }

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const result = await docClient.send(command);
    console.log('DynamoDB result:', result);

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item ?? {}),
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message.includes('Missing') ? 400 : 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
    */

// return {
//   statusCode: 200,
//   body: JSON.stringify({
//     quote: 'Hello my quote!',
//   }),
// };
