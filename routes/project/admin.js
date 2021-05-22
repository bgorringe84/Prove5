const express = require('express');

const adminController = require('../../controller/project/admin');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.get('/add-car', isAuth, adminController.getAddCar);
router.post('/add-car', isAuth, adminController.postAddCar);
router.get('/edit-car', isAuth, adminController.getEditCar);
// router.post('/edit-car', isAuth, adminController.postEditCar);



module.exports = router;