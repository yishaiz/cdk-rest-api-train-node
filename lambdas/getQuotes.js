exports.handlers = async (event, context) => {
  const quotes = [
    {
      id: 1,
      text: 'The only limit to our realization of tomorrow is our doubts of today.',
      by: 'Franklin D. Roosevelt',
    },
    {
      id: 2,
      text: 'The future belongs to those who believe in the beauty of their dreams.',
      by: 'Eleanor Roosevelt',
    },
    {
      id: 3,
      text: 'It does not matter how slowly you go as long as you do not stop.',
      by: 'Confucius',
    },
    {
      id: 4,
      text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      by: 'Winston S. Churchill',
    },
    {
      id: 5,
      text: 'You are never too old to set another goal or to dream a new dream.',
      by: 'C.S. Lewis',
    },
  ];

  const item = quotes[Math.floor(Math.random() * quotes.length)];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  };
};

//     body: JSON.stringify({
//   message: 'Hello from getQuotes handler!',
//   event: event,
//   context: context,
// }),
// const { getQuotes } = require('../services/quotesService');
//   try {
//     const quotes = await getQuotes();

//     return {
//       statusCode: 200,
//       body: JSON.stringify(quotes),
//     };
//   } catch (error) {
//     console.error('Error fetching quotes:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
