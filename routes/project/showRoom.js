const express = require('express');

const showRoomController = require('../../controller/project/showRoom');

const router = express.Router();

//middleware
router.get('/project', showRoomController.getCars);
router.get('/cars/:carId', showRoomController.getDetail);
router.get('/cart', showRoomController.getCart);
router.post('/cart', showRoomController.postCart);
router.post('/cart-remove-car', showRoomController.postCartRemoveCar);
router.post('/increment-quantity', showRoomController.postCart);
// router.post('/decrement-quantity', showRoomController.postDecreaseQuantity);
module.exports = router;
