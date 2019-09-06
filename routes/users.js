const path = require('path');

const userRoutes = (app, fs) => {
  const dataPath = path.join(__dirname, '../data/users.json');
  let userList = [];
  const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  // Authentication
  app.post('/users/authenticate', (req, res) => {
        readFile(data => {
          const users = data['users'];
          const user = users.find(x => x.username === req.body.username && x.password === req.body.password);
          console.log(user);
          if (!user) {
            return res.status(401).send({
              code: '401',
              message: 'Username or password is incorrect'
            });
          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: 'fake-jwt-token'
          });
        }, true);
      }
  );

  // Get users
  app.get('/users/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      res.status(200).send(JSON.parse(data)['users']);
    })
  });

  // Get user info
  app.get('/users/:id', (req, res) => {
    readFile(data => {
      const requestId = parseInt(req.params['id']);
      return res.status(200).send(data['users'].find(x => x.id === requestId));
    }, true)
  });

  // CREATE
  app.post('/users/', (req, res) => {
        readFile(data => {
              userList = data['users'];
              const newUserId = userList.length + 1;
              let body = req.body;
              console.log(userList);
              userList.push({id: newUserId, ...body});
              writeFile(JSON.stringify(data, null, 2),() => {
                res.status(200).send(body);
              });
            }, true,
        );
      }
  );

  // DELETE
  app.delete('/users/:id', (req, res) => {
    console.log('[backend] Delete works');
    readFile(data => {
          // add the new user
          const userId = req.params["id"];
          console.log('Received id', userId);
          userList = data['users'];
          userList = userList.filter(x => x.id !== parseInt(userId));
          data['users'] = userList;

          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`User id:${userId} removed`);
            console.log(`User id: ${userId} removed`);
          });
        },
        true);
  });


  // Update user
  app.put('/users/:id', (req, res) => {
        readFile(data => {
          const requestId = parseInt(req.params['id']);
          const user = data['users'].find(x => x.id === requestId);

          if (!req.body) {
            return res.status(400).send('No body');
          }

          console.log('Query: ', req.query);
          console.log('Body: ', req.body);
          console.log('Params: ', req.params);

          if (req.body.firstName) {
            user.firstName = req.body.firstName;
          }
          if (req.body.lastName) {
            user.lastName = req.body.lastName;
          }
          if (req.body.age) {
            user.age = req.body.age;
          }
          if (req.body.gender) {
            user.gender = req.body.gender;
          }
          writeFile(JSON.stringify(data, null, 2),() => {
            res.status(200).send({user});
          });
        }, true)
      }
  );
};

module.exports = userRoutes;
