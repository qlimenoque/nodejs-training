const userRoutes = require('./users.js');

const appRouter = (app, fs) => {
  app.get('/', (req, res) => {
    res.send('Welcome to the development api-server');
  });

  userRoutes(app, fs);
};

module.exports = appRouter;
