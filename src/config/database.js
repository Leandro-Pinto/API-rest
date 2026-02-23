const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/api_auth_roles';

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    // eslint-disable-next-line no-console
    console.log('Conectado a MongoDB');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error conectando a MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;

