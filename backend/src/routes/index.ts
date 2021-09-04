import express from "express";
const router = express.Router();

import * as indexController from "../controllers/indexController";

// GET home page.
router.get('/', indexController.index);

export { router as indexRouter };
