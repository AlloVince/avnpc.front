const prod = process.env.NODE_ENV === 'production';

module.exports = {
  'process.env.BACKEND_URL': prod ? 'https://api.avnpc.com' : 'http://localhost:3001',
  'process.env.FRONTEND_URL': prod ? 'https://avnpc.com' : 'http://localhost:3000'
};
