const config = process.env.NODE_ENV === 'production' ? {
  BACKEND_URL: 'http://api.avnpc.com:3000',
  FRONTEND_URL: 'https://avnpc.com'
} : {
  BACKEND_URL: 'http://localhost:3001',
  FRONTEND_URL: 'http://localhost:3000'
};

Object.assign(process.env, config);

module.exports = config;
