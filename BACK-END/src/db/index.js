const mongoose = require('mongoose');

const {
  MONGO_URI: mongoUri
} = process.env;


module.exports = (function() {
  mongoose.promise = global.Promise;
  return {
    connect() {
      mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      }).then(
        () => {
          console.log('✅  Successfully connected to mongodb!');
        }
      ).catch(e => {
        console.error(e);
      });
    }
  };
})();