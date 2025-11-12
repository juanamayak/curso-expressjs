const {Router} = require('express');
const reservationController = require('../controllers/reservationController');
const AuthMiddleware = require('../middlewares/auth');
const router = Router();


router.post('/', AuthMiddleware, reservationController.createReservation);
router.get('/:id', AuthMiddleware, reservationController.getReservations);
router.put('/:id', AuthMiddleware, reservationController.updateReservation);
router.delete('/:id', AuthMiddleware, reservationController.deleteReservation);

module.exports = router;