const path = require('path');

class User {
  constructor(id, username, password, firstName, lastName, age, gender) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
  }
}




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

  app.get('/users/:id', (req, res) => {
    readFile(data => {
      const requestId = parseInt(req.params['id']);
      return console.log(data['users'].find(x => x.id === requestId));
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
