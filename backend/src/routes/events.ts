import express from "express";
const router = express.Router();

import * as eventsController from "../controllers/eventsController";

// GET events home page.
router.get('/events/', eventsController.index);

// GET event details.
router.get('/events/:eventId(\\d+)', eventsController.eventDetails);

// GET sector details.
router.get('/events/:eventId(\\d+)/sectors/:sectorId(\\d+)', eventsController.sectorDetails);

export { router as eventsRouter };