import * as redisUtils from "../redis/redisUtils";
import {redisClient} from "../redis/redisUtils";

export const REDIS_EVENT_PREFIX = "event-";
export const REDIS_EVENTS_LIST_KEY = "events";
export const REDIS_FIELD_ID = "id";
export const REDIS_FIELD_NAME = "name";
export const REDIS_FIELD_NUMBER_OF_SECTORS = "numberOfSectors";

export function getEventKey(eventId: number) {
    return REDIS_EVENT_PREFIX + eventId;
}

export async function getEvents(fromId: number, toId: number) {
    if (! await redisUtils.existsKey(REDIS_EVENTS_LIST_KEY)) {
        return Array();
    }

    const eventKeys = await redisUtils.getFromList(REDIS_EVENTS_LIST_KEY, fromId, toId);
    const events = Array();
    for (const eventKey of eventKeys) {
        const event = await redisUtils.getHash(eventKey)
        events.push(event);
    }

    return events;
}

export async function createEvent(eventId: number, eventName: string) {
    const eventKey = getEventKey(eventId);
    if (await redisUtils.existsKey(eventKey)) {
        throw new Error('Event with id \'' + eventId + '\' already exists!');
    }

    redisClient
        .multi()
        .hmset(
            eventKey,
            REDIS_FIELD_ID, eventId,
            REDIS_FIELD_NAME, eventName,
            REDIS_FIELD_NUMBER_OF_SECTORS, 0
        )
        .rpush(REDIS_EVENTS_LIST_KEY, eventKey)
        .exec((error, replies) => {
            if (error) throw error;
        });
}

export async function getEvent(eventId: number) {
    const eventKey = getEventKey(eventId);
    if (! await redisUtils.existsKey(eventKey)) {
        throw new Error('Event with id \'' + eventId + '\' does not exist!');
    }

    return await redisUtils.getHash(eventKey);
}