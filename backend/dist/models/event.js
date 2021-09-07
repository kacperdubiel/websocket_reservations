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
exports.getEvent = exports.createEvent = exports.getEvents = exports.getEventKey = exports.REDIS_FIELD_NUMBER_OF_SECTORS = exports.REDIS_FIELD_NAME = exports.REDIS_FIELD_ID = exports.REDIS_EVENTS_LIST_KEY = exports.REDIS_EVENT_PREFIX = void 0;
const redisUtils = __importStar(require("../redis/redisUtils"));
const redisUtils_1 = require("../redis/redisUtils");
exports.REDIS_EVENT_PREFIX = "event-";
exports.REDIS_EVENTS_LIST_KEY = "events";
exports.REDIS_FIELD_ID = "id";
exports.REDIS_FIELD_NAME = "name";
exports.REDIS_FIELD_NUMBER_OF_SECTORS = "numberOfSectors";
function getEventKey(eventId) {
    return exports.REDIS_EVENT_PREFIX + eventId;
}
exports.getEventKey = getEventKey;
function getEvents(fromId, toId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield redisUtils.existsKey(exports.REDIS_EVENTS_LIST_KEY))) {
            return Array();
        }
        const eventKeys = yield redisUtils.getFromList(exports.REDIS_EVENTS_LIST_KEY, fromId, toId);
        const events = Array();
        for (const eventKey of eventKeys) {
            const event = yield redisUtils.getHash(eventKey);
            events.push(event);
        }
        return events;
    });
}
exports.getEvents = getEvents;
function createEvent(eventId, eventName) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = getEventKey(eventId);
        if (yield redisUtils.existsKey(eventKey)) {
            throw new Error('Event with id \'' + eventId + '\' already exists!');
        }
        redisUtils_1.redisClient
            .multi()
            .hmset(eventKey, exports.REDIS_FIELD_ID, eventId, exports.REDIS_FIELD_NAME, eventName, exports.REDIS_FIELD_NUMBER_OF_SECTORS, 0)
            .rpush(exports.REDIS_EVENTS_LIST_KEY, eventKey)
            .exec((error, replies) => {
            if (error)
                throw error;
        });
    });
}
exports.createEvent = createEvent;
function getEvent(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventKey = getEventKey(eventId);
        if (!(yield redisUtils.existsKey(eventKey))) {
            throw new Error('Event with id \'' + eventId + '\' does not exist!');
        }
        return yield redisUtils.getHash(eventKey);
    });
}
exports.getEvent = getEvent;
//# sourceMappingURL=event.js.map