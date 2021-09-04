import * as redisUtils from "../redis/redisUtils";
import {getEventKey} from "./event";
import * as Sector from "./sector";
import {getSectorKey} from "./sector";
import {redisClient} from "../redis/redisUtils";

export const REDIS_PLACE_PREFIX = "place-";
export const REDIS_PLACES_LIST_KEY = "places";

export function getPlaceKey(eventId: number, sectorId: number, placeId: number) {
    return getSectorKey(eventId, sectorId) + ":" + REDIS_PLACE_PREFIX + placeId;
}

function getPlacesListKey(eventId: number, sectorId: number) {
    return getSectorKey(eventId, sectorId) + ":" + REDIS_PLACES_LIST_KEY;
}

export async function getPlaces(eventId: number, sectorId: number, fromId: number, toId: number) {
    if (! await redisUtils.existsKey(getEventKey(eventId))) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    if (! await redisUtils.existsKey(getSectorKey(eventId, sectorId))) {
        throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
    }

    const places = Array();
    const placesListKey = getPlacesListKey(eventId, sectorId);
    if (! await redisUtils.existsKey(placesListKey)) {
        return places;
    }

    const placeKeys = await redisUtils.getFromList(placesListKey, fromId, toId);

    for(const placeKey of placeKeys){
        const place = {
            placeId: placeKey.split(REDIS_PLACE_PREFIX).pop(),
            clientId: await redisUtils.getValue(placeKey)
        }
        places.push(place);
    }

    return places;
}

export async function setPlace(eventId: number, sectorId: number, placeId: number, clientId: string) {
    if (! await redisUtils.existsKey(getEventKey(eventId))) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    const sectorKey = getSectorKey(eventId, sectorId);
    if (! await redisUtils.existsKey(sectorKey)) {
        throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
    }

    const placeKey = getPlaceKey(eventId, sectorId, placeId);
    if (await redisUtils.existsKey(placeKey)) {
        throw new Error('Place with id \'' + placeId + '\' in event \'' + eventId + '\', sector \'' + sectorId + '\' is already taken!');
    }

    if (! await isValidPlace(eventId, sectorId, placeId)) {
        throw new Error('Place id \'' + placeId + '\' is not valid!');
    }

    redisClient
        .multi()
        .set(placeKey, clientId, 'NX')
        .rpush(getPlacesListKey(eventId, sectorId), placeKey)
        .exec((error, replies) => {
            if (error) throw error;
            if (!replies[0])
                throw new Error("Place already taken!");
        });
}

export async function removePlace(eventId: number, sectorId: number, placeId: number) {
    if (! await redisUtils.existsKey(getEventKey(eventId))) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    const sectorKey = getSectorKey(eventId, sectorId);
    if (! await redisUtils.existsKey(sectorKey)) {
        throw new Error('Sector with id \'' + sectorId + '\' does not exist in event \'' + eventId + '\'!');
    }

    const placeKey = getPlaceKey(eventId, sectorId, placeId);
    if (! await redisUtils.existsKey(placeKey)) {
        throw new Error('Place with id \'' + placeId + '\' does not exist in event \'' + eventId + '\', sector \'' + sectorId + '\'!');
    }

    if (! await isValidPlace(eventId, sectorId, placeId)) {
        throw new Error('Place id \'' + placeId + '\' is not valid!');
    }

    redisClient
        .multi()
        .del(placeKey)
        .lrem(getPlacesListKey(eventId, sectorId), 0, placeKey)
        .exec((error, replies) => {
            if (error) throw error;
        });
}

async function isValidPlace(eventId: number, sectorId: number, placeId: number) {
    const sectorKey = getSectorKey(eventId, sectorId);
    const placesInSector = await redisUtils.getFieldFromHash(sectorKey, Sector.REDIS_FIELD_NUMBER_OF_PLACES);

    return placeId > 0 && placeId <= placesInSector;
}