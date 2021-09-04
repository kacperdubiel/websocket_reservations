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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeData = exports.getFromList = exports.getHash = exports.getFieldFromHash = exports.getValue = exports.existsKey = exports.redisClient = void 0;
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const event_1 = require("../models/event");
const sector_1 = require("../models/sector");
const place_1 = require("../models/place");
exports.redisClient = redis_1.default.createClient({
    host: 'redis-service',
    port: Number(process.env.REDIS_PORT)
});
const existsAsync = (0, util_1.promisify)(exports.redisClient.exists).bind(exports.redisClient);
const getAsync = (0, util_1.promisify)(exports.redisClient.get).bind(exports.redisClient);
const hgetAsync = (0, util_1.promisify)(exports.redisClient.hget).bind(exports.redisClient);
const hgetallAsync = (0, util_1.promisify)(exports.redisClient.hgetall).bind(exports.redisClient);
const lrangeAsync = (0, util_1.promisify)(exports.redisClient.lrange).bind(exports.redisClient);
function existsKey(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield existsAsync(key);
    });
}
exports.existsKey = existsKey;
function getValue(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getAsync(key);
    });
}
exports.getValue = getValue;
function getFieldFromHash(key, field) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield hgetAsync(key, field);
    });
}
exports.getFieldFromHash = getFieldFromHash;
function getHash(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield hgetallAsync(key);
    });
}
exports.getHash = getHash;
function getFromList(key, fromId, toId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield lrangeAsync(key, fromId, toId);
    });
}
exports.getFromList = getFromList;
function initializeData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, event_1.createEvent)(1, "Kabaret Moralnego Niepokoju");
            yield (0, event_1.createEvent)(2, "Lady Pank");
            yield (0, event_1.createEvent)(3, "Kabaret Neo-Nówka");
            yield (0, sector_1.createSector)(1, 1, "Sektor A", 50);
            yield (0, sector_1.createSector)(1, 2, "Sektor B", 45);
            yield (0, sector_1.createSector)(1, 3, "Sektor C", 70);
            yield (0, sector_1.createSector)(2, 1, "Sektor Lewy", 30);
            yield (0, sector_1.createSector)(2, 2, "Sektor Prawy", 50);
            yield (0, place_1.setPlace)(1, 1, 3, "abc123");
            yield (0, place_1.setPlace)(1, 1, 4, "abc123");
            yield (0, place_1.setPlace)(1, 1, 7, "xyz123");
            yield (0, place_1.setPlace)(1, 1, 30, "qwe321");
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.initializeData = initializeData;
//# sourceMappingURL=redisUtils.js.map