const config = ['production', 'preview'].includes(process.env.NODE_ENV) ? {
  ENV: process.env.NODE_ENV || 'production',
  BACKEND_URL: process.env.BACKEND_URL || 'https://api.avnpc.com',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://avnpc.com'
} : {
  ENV: process.env.NODE_ENV || 'development',
  // BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
  // FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
  BACKEND_URL: process.env.BACKEND_URL || 'https://api.avnpc.com',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://avnpc.com'
};

Object.assign(process.env, config);

module.exports = config;
