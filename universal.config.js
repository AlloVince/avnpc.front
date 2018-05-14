const config = process.env.NODE_ENV === 'production' ? {
  BACKEND_URL: process.env.BACKEND_URL || 'http://api.avnpc.com:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://avnpc.com:5000'
} : {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

Object.assign(process.env, config);

module.exports = config;
