const { Router } = require('express');
const authRouter = require('./auth');
const adminRouter = require('./admin');
const reservationRouter = require('./reservations');
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/reservations', reservationRouter);

module.exports = router;