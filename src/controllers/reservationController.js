const {reservationService} = require("../services/reservationService");


exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.getReservations = async (req, res) => {
    try{
        const reservation = await reservationService.getReservations(req.params.id);
        if (!reservation) {
            res.status(404).json({error: 'No reservation found'});
        }

        res.json(reservation);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.updateReservation = async (req, res) => {
    try {
        const reservation = await reservationService.getReservations(req.params.id, req.body);
        if (!reservation) {
            res.status(404).json({error: 'No reservation found'});
        }
        res.json(reservation);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.deleteReservation = async (req, res) => {
    try {
        const result = await reservationService.deleteReservation(req.params.id);
        if (!result) {
            res.status(404).json({error: 'No reservation found'});
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}