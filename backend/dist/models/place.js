"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.removePlace = exports.setPlace = exports.getClientPlaces = exports.getPlaces = exports.getPlace = exports.REDIS_PLACES_LIST_KEY = exports.REDIS_PLACE_PREFIX = void 0;
const redisUtils = __importStar(require("../redis/redisUtils"));
const event_1 = require("./event");
const Sector = __importStar(require("./sector"));
const sector_1 = require("./sector");
const redisUtils_1 = require("../redis/redisUtils");
exports.REDIS_PLACE_PREFIX = "place-";
exports.REDIS_PLACES_LIST_KEY = "places";
function getPlaceKey(eventId, sectorId, placeId) {
    return (0, sector_1.getSectorKey)(eventId, sectorId) + ":" + exports.REDIS_PLACE_PREFIX + placeId;
}
function getPlacesListKey(eventId, sectorId) {
    return (0, sector_1.getSectorKey)(eventId, sectorId) + ":" + exports.REDIS_PLACES_LIST_KEY;
}
function getPlace(eventId, sectorId, placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield redisUtils.existsKey((0, event_1.getEventKey)(eventId)))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        if (!(yield redisUtils.existsKey((0, sector_1.getSectorKey)(eventId, sectorId)))) {
            throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
        }
        const placeKey = getPlaceKey(eventId, sectorId, placeId);
        if (!(yield redisUtils.existsKey(placeKey))) {
            throw new Error('Place with id \'' + placeId + '\' does not exist in event \'' + eventId + '\', sector \'' + sectorId + '\'!');
        }
        return yield redisUtils.getValue(placeKey);
    });
}
exports.getPlace = getPlace;
function getPlaces(eventId, sectorId, fromId, toId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield redisUtils.existsKey((0, event_1.getEventKey)(eventId)))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        if (!(yield redisUtils.existsKey((0, sector_1.getSectorKey)(eventId, sectorId)))) {
            throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
        }
        const places = Array();
        const placesListKey = getPlacesListKey(eventId, sectorId);
        if (!(yield redisUtils.existsKey(placesListKey))) {
            return places;
        }
        const placeKeys = yield redisUtils.getFromList(placesListKey, fromId, toId);
        for (const placeKey of placeKeys) {
            const place = {
                placeId: placeKey.split(exports.REDIS_PLACE_PREFIX).pop(),
                clientId: yield redisUtils.getValue(placeKey)
            };
            places.push(place);
        }
        return places;
    });
}
exports.getPlaces = getPlaces;
function getClientPlaces(eventId, sectorId, clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield redisUtils.existsKey((0, event_1.getEventKey)(eventId)))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        if (!(yield redisUtils.existsKey((0, sector_1.getSectorKey)(eventId, sectorId)))) {
            throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
        }
        const clientPlaces = Array();
        const placesListKey = getPlacesListKey(eventId, sectorId);
        if (!(yield redisUtils.existsKey(placesListKey))) {
            return clientPlaces;
        }
        const placeKeys = yield redisUtils.getFromList(placesListKey, 0, -1);
        for (const placeKey of placeKeys) {
            const placeClientId = yield redisUtils.getValue(placeKey);
            if (placeClientId === clientId) {
                const place = {
                    placeId: placeKey.split(exports.REDIS_PLACE_PREFIX).pop()
                };
                clientPlaces.push(place);
            }
        }
        return clientPlaces;
    });
}
exports.getClientPlaces = getClientPlaces;
function setPlace(eventId, sectorId, placeId, clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield redisUtils.existsKey((0, event_1.getEventKey)(eventId)))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        const sectorKey = (0, sector_1.getSectorKey)(eventId, sectorId);
        if (!(yield redisUtils.existsKey(sectorKey))) {
            throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
        }
        const placeKey = getPlaceKey(eventId, sectorId, placeId);
        if (yield redisUtils.existsKey(placeKey)) {
            throw new Error('Place with id \'' + placeId + '\' in event \'' + eventId + '\', sector \'' + sectorId + '\' is already taken!');
        }
        if (!(yield isValidPlace(eventId, sectorId, placeId))) {
            throw new Error('Place id \'' + placeId + '\' is not valid!');
        }
        try {
            redisUtils_1.redisClient
                .multi()
                .set(placeKey, clientId, 'NX')
                .rpush(getPlacesListKey(eventId, sectorId), placeKey)
                .exec((error, replies) => {
                if (error)
                    throw error;
                if (!replies[0])
                    throw new Error("Place already taken!");
            });
        }
        catch (e) {
            throw new Error("Place already taken!!!");
        }
    });
}
exports.setPlace = setPlace;
function removePlace(eventId, sectorId, placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield redisUtils.existsKey((0, event_1.getEventKey)(eventId)))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        const sectorKey = (0, sector_1.getSectorKey)(eventId, sectorId);
        if (!(yield redisUtils.existsKey(sectorKey))) {
            throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
        }
        const placeKey = getPlaceKey(eventId, sectorId, placeId);
        if (!(yield redisUtils.existsKey(placeKey))) {
            throw new Error('Place with id \'' + placeId + '\' does not exist in event \'' + eventId + '\', sector \'' + sectorId + '\'!');
        }
        if (!(yield isValidPlace(eventId, sectorId, placeId))) {
            throw new Error('Place id \'' + placeId + '\' is not valid!');
        }
        redisUtils_1.redisClient
            .multi()
            .del(placeKey)
            .lrem(getPlacesListKey(eventId, sectorId), 0, placeKey)
            .exec((error, replies) => {
            if (error)
                throw error;
        });
    });
}
exports.removePlace = removePlace;
function isValidPlace(eventId, sectorId, placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sectorKey = (0, sector_1.getSectorKey)(eventId, sectorId);
        const placesInSector = Number(yield redisUtils.getFieldFromHash(sectorKey, Sector.REDIS_FIELD_NUMBER_OF_PLACES));
        return placeId > 0 && placeId <= placesInSector;
    });
}
//# sourceMappingURL=place.js.map