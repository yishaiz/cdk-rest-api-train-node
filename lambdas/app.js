const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log('Event::::', JSON.stringify(event, null, 2));
  console.log('Event::::', event);

  const path = event.resource;
  const httpMethod = event.httpMethod;
  const route = httpMethod.concat(' ').concat(path);

  const data = JSON.parse(event.body || '{}');

  console.log({ path, httpMethod, route, data });

  let body;
  let statusCode = 200;

  try {
    switch (route) {
      case 'GET /quotes': {
        body = await listQuotes();
        break;
      }
      case 'POST /quotes': {
        body = await saveQuote(data);
        break;
      }
      default: {
        throw new Error(`Unsupported route: ${route}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);

    statusCode = error.message.includes('Unsupported route') ? 404 : 500;
    body = error.message || 'Internal Server Error';
  } finally {
    console.log('Response:', { statusCode, body });
    body = JSON.stringify(body || {});
  }
  return sendResponse(statusCode, body);
};

async function saveQuote(data) {
  const time = new Date().getTime();
  const { quote, by } = data;

  const newQuote = {
    id: time.toString(),
    quote,
    by,
  };

  const params = {
    TableName: TABLE_NAME,
    Item: newQuote,
  };

  return docClient.put(params).then(() => {
    return item;
  });
}

async function listQuotes() {
  return 'list of quotes ...';
}

// return dynamo
//   .put(params)
//   .promise()
//   .then(() => {
//     return item;
// return newQuote;
//   });

// let body = await listQuotes();

// const body = await docClient.scan({ TableName: TABLE_NAME }).promise();
// console.log('Quotes:', body);
// return sendResponse(200, JSON.stringify(body.Items || []));
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
