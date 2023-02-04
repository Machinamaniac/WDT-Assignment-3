const User = require('../models/User');
const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

/**
 * Retrieves the database according to the connection.
 * 
 * @returns the SQL database 
 */
const getDb = () => {
  return connection;
}

module.exports.getDb = getDb;


// Add new user - new version
module.exports.create = (req, res) => {
  const { first_name, last_name, 
    email, phone, comments } = req.body;
  let searchTerm = req.body.search;

  const user = new User(first_name, last_name, 
    email, phone, comments);
    
  user.save()
  .then(result => {
    // console.log(result);
    res.render('add-user', { alert: 'User added successfully.' });
  })
  .catch(err => {
    console.log(err);
  });
}


// Add new user - old version
// module.exports.create = (req, res) => {
//   const { first_name, last_name, email, phone, comments } = req.body;
//   let searchTerm = req.body.search;

//   // User the connection
//   connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
//     if (!err) {
//       res.render('add-user', { alert: 'User added successfully.' });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }



// Find User by Search - new version
module.exports.find = (req, res) => {
  let searchTerm = req.body.search;

  User.findBySearchTerm(searchTerm)
    // We retrieve rows from the database, not a user object.
    .then(rows => {
      res.render('home', { rows });
    })
    .catch(err => {
      // console.log(err);
    });
}

// Find User by Search - old version
// module.exports.find = (req, res) => {
//   let searchTerm = req.body.search;
//   // User the connection
//   connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
//     if (!err) {
//       res.render('home', { rows });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }





// View Users - new version
module.exports.view = (req, res) => {
  let removedUser = req.query.removed;

  User.viewActiveUsers(req)
  .then((rows) => {
    res.render('home', { rows, removedUser });
  })
  .catch(err => {
    console.log("There was a problem viewing the users: " 
      + err);
  });
}



// View Users - old version
// module.exports.view = (req, res) => {
//   // User the connection
//   connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
//     // When done with the connection, release it
//     if (!err) {
//       let removedUser = req.query.removed;
//       res.render('home', { rows, removedUser });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }


module.exports.form = (req, res) => {
  //added a bit here because did not know how to fix otherwise
  res.render('add-user', {alert:null});
}

// Edit user - new version
module.exports.edit = (req, res) => {
  let id = req.params.id;
  User.editById(id)
  .then((rows) => {
    //same goes here (alert:null added)
      res.render('edit-user', { rows , alert : null });
  })
  .catch(err => {
    console.log("There was a problem viewing the users: " 
      + err);
  }); 
}

// Edit user - old version
// module.exports.edit = (req, res) => {
//   // User the connection
//   connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//     if (!err) {
//       res.render('edit-user', { rows });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }


// Update User - new version
module.exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let user = new User(first_name, last_name, email, phone, comments);
  let id = req.params.id;

  user.update(id)
  .then((rows) => {
    res.render('edit-user', 
    { rows, alert: `${first_name} has been updated.` });
  })
  .catch(err => {
    console.log("There was a problem updating the users: " 
      + err);
  });

}

// Update User - old version
// module.exports.update = (req, res) => {
//   const { first_name, last_name, email, phone, comments } = req.body;
//   // User the connection
//   connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

//     if (!err) {
//       // User the connection
//       connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//         // When done with the connection, release it
        
//         if (!err) {
//           res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
//         } else {
//           console.log(err);
//         }
//         console.log('The data from user table: \n', rows);
//       });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }

// Delete User - new version
module.exports.delete = (req, res) => {
  // Hide a record
  let id = req.params.id;
  User.hide(id)
  .then((rows) => {
    let removedUser = 
      encodeURIComponent('User successeflly removed.');
    res.redirect('/?removed=' + removedUser);
  })
  .catch(err => {
    console.log("There was a problem viewing the users: " 
      + err);
  }); 
}



//This I do not know what is wrong, no idea how to approach this correctly in general
//Activate/Deactivate User
exports.de_activate = (req, res) => {
  const {status} = req.params.status;
  let newStatus;
  if(status === 'none') {
    newStatus = 'active';
  } else {
    newStatus = 'none';
  }
    connection.query('UPDATE user SET status = ? WHERE id = ?', [newStatus, req.params.id], (err, rows) => {
      if(!err) {
        console.log("STATUS:" + newStatus);
        res.redirect('/', { rows });
      } else {
        console.log(err);
      }
    });
}

// Update User - new version
// This was left undebugged because there was no application of this function on the server.
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let user = new User(first_name, last_name, email, phone, comments);
  let id = req.params.id;
  user.update(id)
  .then(rows => {
    res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
  })
  .catch(err => {
    console.log("There was a problem updating the user: " + err);
  });
}


// // Update User - old version
// exports.update = (req, res) => {
//   const { first_name, last_name, email, phone, comments } = req.body;
//   // User the connection
//   connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',
//   [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

//     if (!err) {
//       // User the connection
//       connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//         // When done with the connection, release it
        
//         if (!err) {
//           res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
//         } else {
//           console.log(err);
//         }
//         console.log('The data from user table: \n', rows);
//       });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }


// Delete User - new version
module.exports.delete = (req, res) => {
  // Hide a record
  let id = req.params.id;
  User.hide(id)
  .then((rows) => {
    let removedUser = 
      encodeURIComponent('User successeflly removed.');
    res.redirect('/?removed=' + removedUser);
  })
  .catch(err => {
    console.log("There was a problem viewing the users: " 
      + err);
  }); 
}



// Delete User - old version
// module.exports.delete = (req, res) => {

//   // Delete a record

//   // User the connection
//   // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

//   //   if(!err) {
//   //     res.redirect('/');
//   //   } else {
//   //     console.log(err);
//   //   }
//   //   console.log('The data from user table: \n', rows);

//   // });

//   // Hide a record
//   connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//     if (!err) {
//       let removedUser = encodeURIComponent('User successeflly removed.');
//       res.redirect('/?removed=' + removedUser);
//     } else {
//       console.log(err);
//     }
//     console.log('The data from beer table are: \n', rows);
//   });

// }

// View Users - new version
module.exports.viewall = (req, res) => {
  let id = req.params.id;
  User.viewAll(id)
  .then(rows => {
    res.render('view-user', { rows });
  })
  .catch(err => {
    console.log("There was a problem viewing all the users : " 
      + err);
  });
}
