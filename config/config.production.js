module.exports = {
  sequelize: {
    logging: false
  },
  db: {
    database: 'avnpc',
    replication: {
      write: {
        host: process.env.DB_REPLICATION_WRITE_HOST || 'db',
        username: process.env.DB_REPLICATION_WRITE_USERNAME || 'avnpc',
        password: process.env.DB_REPLICATION_WRITE_PASSWORD || 'MySQL_password'
      },
      read: [
        {
          host: process.env.DB_REPLICATION_READ0_HOST || 'db',
          username: process.env.DB_REPLICATION_READ0_USERNAME || 'avnpc',
          password: process.env.DB_REPLICATION_READ0_PASSWORD || 'MySQL_password'
        }
      ]
    }
  }
};
