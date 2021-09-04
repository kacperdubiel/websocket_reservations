import express from "express";
const router = express.Router();

import * as placesController from "../controllers/placesController";

// POST place
router.post('/events/:eventId(\\d+)/sectors/:sectorId(\\d+)/places', placesController.createPlace);

// DELETE place
router.delete('/events/:eventId(\\d+)/sectors/:sectorId(\\d+)/places/:placeId(\\d+)', placesController.deletePlace);

export { router as placesRouter };