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

  // Get users
  app.get('/users/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data)['users']);
    })
  });

  // CREATE
  app.post('/users/', (req, res) => {
        readFile(data => {
              userList = data['users'];
              const newUserId = userList.length + 1;
              console.log(userList);
              console.log(newUserId);
              userList.push(
                  {
                    id: newUserId,
                    username: '123'
                  }
              );
              writeFile(JSON.stringify(data, null, 2),() => {
                res.status(200).send('new user added');
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
            console.log(`User id:${userId} removed`);
          });
        },
        true);
  });
};

module.exports = userRoutes;
