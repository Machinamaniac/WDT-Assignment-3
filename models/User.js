const controllerObject = require('../controllers/userController');

// This doesn't work for whatever reason. 
// When I try to call getDb with 'getDb()', it says it's not a function.
// const getDb = controllerObject.getDb; 

/**
 * This User class is not as active as it would have been in MongoDB because
 * we don't insert or retrieve actual User instances into/from the database. 
 * SQL works with queries, not objects.
 * This User class is more of an abstraction through which we can perform the queries.
 * 
 */
class User {
    /**
     * Constructs a user.
     * 
     * @param {*} first_name 
     * @param {*} last_name 
     * @param {*} email 
     * @param {*} phone 
     * @param {*} comments 
     */
    constructor(first_name, last_name, email, phone, comments) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.comments = comments;
        // Every user is active by default when instantiated.
        // this.status = 'active';
    }

    /**
     * Saves the user in the database.
     * Note that it does not save the user object per se becaue SQL works with queries.
     */
    save() {
        const db = controllerObject.getDb();
        return new Promise((resolve, reject) => {
          db.query(
            'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', 
            [this.first_name, this.last_name, this.email, this.phone, this.comments], 
            (err, rows) => {
              if (err) {
                reject('Something went wrong when saving the user');
              }
              else {
                resolve('The data from user table: \n', rows);
              }
            });
        }); 
    }


    /**
     * Finds a user given a search term
     * 
     * @param searchTerm seartTerm to search with
     * @returns rows (not a user object) resulting from the SQL query
     */
      static findBySearchTerm(searchTerm) {
        const db = controllerObject.getDb();
  
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', 
          ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
                if (!err) {
                  resolve(rows);
                } else {
                  reject('There was an issue with finding the users: ' + err);
                }
              });
        });
      }



    static viewActiveUsers() {
      const db = controllerObject.getDb();

      // User the connection
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE status = "active"', [], (err, rows) => {
          if (!err) {
            resolve(rows);
          } else {
            reject('There was an issue with viewing the active users: ' + err);
          }
        });
      });
  }

    static editById(id) {
      const db = controllerObject.getDb();

      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE id = ?', 
        [id], (err, rows) => {
          if (!err) {
            resolve(rows);
          } else {
            reject("There was a problem editing the user based on ID : " 
              + err);
          }
        });
      })
    }

    // This was left undebugged because there was no application of this function on the server.
    update(id) {
      const db = controllerObject.getDb();

      // User the connection
      return new Promise((resolve, reject) => 
      {
        db.query(
          'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',
          [this.first_name, this.last_name, this.email, this.phone, this.comments, 
          id], (err, rows) => 
          {
            if (!err) 
            {
              // User the connection
              connection.query('SELECT * FROM user WHERE id = ?', 
                [id], (err, rows) => 
              {
                // When done with the connection, release it
                  if (!err) 
                  {
                    resolve(rows);
                  } else 
                  {
                    reject("There was a problem updating the user: " + err);
                  }
                  // console.log('The data from user table: \n', rows);
              });
            } 
            else 
            {
              reject("There was a problem updating the user: " + err);
            }
            // console.log('The data from user table: \n', rows)
        });
      });
    }
    
    // Only the hide method was implemented because
    // that's what the original code was implemented like.
    // static delete(id) {

    // }

    static hide(id) {
      const db = controllerObject.getDb();
      
      return new Promise((resolve, reject) => 
      {
        db.query('UPDATE user SET status = ? WHERE id = ?', 
          ['removed', id], (err, rows) => 
        {
          if (!err) {
            resolve(rows);
          } else {
            reject("There was a problem hiding the user: " + err);
          }
        });
      });
    }

    static viewAll(id) {
      return new Promise((resolve, reject) => 
      {
        connection.query('SELECT * FROM user WHERE id = ?', 
          [id], (err, rows) => 
        {
          if (!err) {
            resolve(rows);
          } else {
            reject("There was a problem viewing all the users : " 
            + err);
          }
        });
      });
    }
}

module.exports = User;