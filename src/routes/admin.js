const {Router} = require('express');
const { createTimeBlock, listReservation} = require('../controllers/adminController');
const router = Router();


router.post('time-blocks', createTimeBlock);
router.get('/reservations', listReservation);

module.exports = router;