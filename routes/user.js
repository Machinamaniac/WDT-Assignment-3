const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Routes
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/viewuser/:id', userController.viewall);
router.get('/:id',userController.delete);

// I added this for the final task but I think I am doing something wrong
router.post('/:id&:status', userController.de_activate);
  
module.exports = router;