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
exports.getSector = exports.createSector = exports.getSectors = exports.getSectorKey = exports.REDIS_FIELD_NUMBER_OF_PLACES = exports.REDIS_FIELD_NAME = exports.REDIS_FIELD_ID = exports.REDIS_SECTORS_LIST_KEY = exports.REDIS_SECTOR_PREFIX = void 0;
const redisUtils = __importStar(require("../redis/redisUtils"));
const Event = __importStar(require("./event"));
const event_1 = require("./event");
const redisUtils_1 = require("../redis/redisUtils");
exports.REDIS_SECTOR_PREFIX = "sector-";
exports.REDIS_SECTORS_LIST_KEY = "sectors";
exports.REDIS_FIELD_ID = "id";
exports.REDIS_FIELD_NAME = "name";
exports.REDIS_FIELD_NUMBER_OF_PLACES = "numberOfPlaces";
function getSectorKey(eventId, sectorId) {
    return (0, event_1.getEventKey)(eventId) + ":" + exports.REDIS_SECTOR_PREFIX + sectorId;
}
exports.getSectorKey = getSectorKey;
function getSectorsListKey(eventId) {
    return (0, event_1.getEventKey)(eventId) + ":" + exports.REDIS_SECTORS_LIST_KEY;
}
function getSectors(eventId, fromId, toId) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = (0, event_1.getEventKey)(eventId);
        if (!(yield redisUtils.existsKey(eventKey))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        const sectors = Array();
        const sectorsListKey = getSectorsListKey(eventId);
        if (!(yield redisUtils.existsKey(sectorsListKey))) {
            return sectors;
        }
        const sectorKeys = yield redisUtils.getFromList(sectorsListKey, fromId, toId);
        for (const sectorKey of sectorKeys) {
            const sector = yield redisUtils.getHash(sectorKey);
            sectors.push(sector);
        }
        return sectors;
    });
}
exports.getSectors = getSectors;
function createSector(eventId, sectorId, sectorName, numberOfPlaces) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = (0, event_1.getEventKey)(eventId);
        if (!(yield redisUtils.existsKey(eventKey))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        const sectorKey = getSectorKey(eventId, sectorId);
        if (yield redisUtils.existsKey(sectorKey)) {
            throw new Error('Sector with id \'' + sectorId + '\' already exists in event \'' + eventId + '\'!');
        }
        redisUtils_1.redisClient
            .multi()
            .hmset(sectorKey, exports.REDIS_FIELD_ID, sectorId, exports.REDIS_FIELD_NAME, sectorName, exports.REDIS_FIELD_NUMBER_OF_PLACES, numberOfPlaces)
            .hincrby(eventKey, Event.REDIS_FIELD_NUMBER_OF_SECTORS, 1)
            .rpush(getSectorsListKey(eventId), sectorKey)
            .exec((error, replies) => {
            if (error)
                throw error;
        });
    });
}
exports.createSector = createSector;
function getSector(eventId, sectorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = (0, event_1.getEventKey)(eventId);
        if (!(yield redisUtils.existsKey(eventKey))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        const sectorKey = getSectorKey(eventId, sectorId);
        if (!(yield redisUtils.existsKey(sectorKey))) {
            throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
        }
        return yield redisUtils.getHash(sectorKey);
    });
}
exports.getSector = getSector;
//# sourceMappingURL=sector.js.map