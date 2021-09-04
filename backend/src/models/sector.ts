import * as redisUtils from "../redis/redisUtils";
import * as Event from "./event";
import {getEventKey} from "./event";
import {redisClient} from "../redis/redisUtils";

export const REDIS_SECTOR_PREFIX = "sector-";
export const REDIS_SECTORS_LIST_KEY = "sectors";
export const REDIS_FIELD_ID = "id";
export const REDIS_FIELD_NAME = "name";
export const REDIS_FIELD_NUMBER_OF_PLACES = "numberOfPlaces";

export function getSectorKey(eventId: number, sectorId: number) {
    return getEventKey(eventId) + ":" + REDIS_SECTOR_PREFIX + sectorId;
}

function getSectorsListKey(eventId: number) {
    return getEventKey(eventId) + ":" + REDIS_SECTORS_LIST_KEY;
}

export async function getSectors(eventId: number, fromId: number, toId: number) {
    const eventKey = getEventKey(eventId);
    if (! await redisUtils.existsKey(eventKey)) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    const sectors = Array();

    const sectorsListKey = getSectorsListKey(eventId);
    if (! await redisUtils.existsKey(sectorsListKey)) {
        return sectors;
    }

    const sectorKeys = await redisUtils.getFromList(sectorsListKey, fromId, toId);
    for (const sectorKey of sectorKeys) {
        const sector = await redisUtils.getHash(sectorKey);
        sectors.push(sector);
    }

    return sectors;
}

export async function createSector(eventId: number, sectorId: number, sectorName: string, numberOfPlaces: number) {
    const eventKey = getEventKey(eventId);
    if (! await redisUtils.existsKey(eventKey)) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    const sectorKey = getSectorKey(eventId, sectorId);
    if (await redisUtils.existsKey(sectorKey)) {
        throw new Error('Sector with id \'' + sectorId + '\' already exists in event \'' + eventId + '\'!');
    }

    redisClient
        .multi()
        .hmset(
            sectorKey,
            REDIS_FIELD_ID, sectorId,
            REDIS_FIELD_NAME, sectorName,
            REDIS_FIELD_NUMBER_OF_PLACES, numberOfPlaces
        )
        .hincrby(eventKey, Event.REDIS_FIELD_NUMBER_OF_SECTORS, 1)
        .rpush(getSectorsListKey(eventId), sectorKey)
        .exec((error, replies) => {
            if (error) throw error;
        });
}

export async function getSector(eventId: number, sectorId: number) {
    const eventKey = getEventKey(eventId);
    if (! await redisUtils.existsKey(eventKey)) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    const sectorKey = getSectorKey(eventId, sectorId);
    if (! await redisUtils.existsKey(sectorKey)) {
        throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
    }

    return await redisUtils.getHash(sectorKey);
}
