const getDb = require('../controllers/userController').getDb;

class User {
    constructor(first_name, last_name, email, phone, comments) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.comments = comments;
    }

    save() {
        const db = getDb();
        return db.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', 
        [first_name, last_name, email, phone, comments], (err, rows) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log('The data from user table: \n', rows);
          }
        });
    }

    // view() {

    // }

    // find() {

    // }



    // edit() {

    // }

    // update() {

    // }

    // delete() {

    // }

    // viewAll() {

    // }
}

module.exports = User;