const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  ScanCommand,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

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
      case 'GET /quotes{id}': {
        body = await listQuotes();
        break;
      }
      case 'POST /quotes': {
        body = await saveQuote(data);
        break;
      }
      case 'DELETE /quotes/{id}': {
        body = await deleteQuote(event.pathParameters.id);
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

  try {
    await docClient.send(new PutCommand(params));
    return newQuote;
  } catch (err) {
    console.error('DynamoDB put error', err);
    throw err;
  }
}

async function deleteQuote(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };

  const result = await docClient.send(new DeleteCommand(params));
  console.log('Delete result:', result);
  return result;
  // try {
  // } catch (err) {
  //   console.error('DynamoDB deletet error', err);
  //   throw err;
  // }
}

async function listQuotes() {
  const params = {
    TableName: TABLE_NAME,
  };

  const data = await docClient.send(new ScanCommand(params));

  return data.Items || [];
}

const sendResponse = (status, body) => {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
};
