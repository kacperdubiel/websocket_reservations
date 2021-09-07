"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.createPlace = void 0;
const place_1 = require("../models/place");
const createPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, place_1.setPlace)(req.params.eventId, req.params.sectorId, req.body.placeId, req.body.clientId);
        res.status(200);
        res.send("Place set!");
    }
    catch (e) {
        res.status(404);
        res.send(e.message);
    }
});
exports.createPlace = createPlace;
const deletePlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, place_1.removePlace)(req.params.eventId, req.params.sectorId, req.params.placeId);
        res.status(200);
        res.send("Place removed!");
    }
    catch (e) {
        res.status(404);
        res.send(e.message);
    }
});
exports.deletePlace = deletePlace;
//# sourceMappingURL=placesController.js.map