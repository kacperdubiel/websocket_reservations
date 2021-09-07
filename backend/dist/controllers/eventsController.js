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
exports.sectorDetails = exports.eventDetails = exports.index = void 0;
const event_1 = require("../models/event");
const sector_1 = require("../models/sector");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield (0, event_1.getEvents)(0, 10);
    res.render("events", { events });
});
exports.index = index;
const eventDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.eventId;
    const event = yield (0, event_1.getEvent)(eventId);
    const sectors = yield (0, sector_1.getSectors)(eventId, 0, 10);
    res.render("events/event", { event, sectors });
});
exports.eventDetails = eventDetails;
const sectorDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.eventId;
    const sectorId = req.params.sectorId;
    const event = yield (0, event_1.getEvent)(eventId);
    const sector = yield (0, sector_1.getSector)(eventId, sectorId);
    // const places = await getPlaces(eventId, sectorId, 0, -1);
    const numberOfColumns = 8;
    res.render("events/sector", { event, sector, numberOfColumns });
});
exports.sectorDetails = sectorDetails;
//# sourceMappingURL=eventsController.js.map