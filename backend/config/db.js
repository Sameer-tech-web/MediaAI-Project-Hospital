const mongoose = require('mongoose');

const cache =
  globalThis.__mediaiMongo ||
  (globalThis.__mediaiMongo = {
    connection: null,
    promise: null,
    listenersAttached: false,
  });

mongoose.set('strictQuery', true);

if (!cache.listenersAttached) {
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    cache.connection = null;
    cache.promise = null;
  });

  cache.listenersAttached = true;
}

const connectDB = async () => {
  if (cache.connection && mongoose.connection.readyState === 1) {
    return cache.connection;
  }

  if (!process.env.MONGO_URI) {
    const error = new Error('MONGO_URI is not configured');
    error.statusCode = 503;
    throw error;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })
      .then((connection) => {
        cache.connection = connection;
        return connection;
      })
      .catch((error) => {
        cache.connection = null;
        cache.promise = null;
        error.statusCode = error.statusCode || 503;
        throw error;
      });
  }

  return cache.promise;
};

module.exports = { connectDB };
