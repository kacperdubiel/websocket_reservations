import redis from "redis";
import {promisify} from "util";

import {createEvent} from "../models/event";
import {createSector} from "../models/sector";
import {setPlace} from "../models/place";

export const redisClient = redis.createClient({
    host: 'redis-service',
    port: Number(process.env.REDIS_PORT)
})

const existsAsync = promisify(redisClient.exists).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);

export async function existsKey(key: string){
    return await existsAsync(key);
}

export async function getValue(key: string){
    return await getAsync(key);
}

export async function getFieldFromHash(key: string, field: string){
    return await hgetAsync(key, field);
}

export async function getHash(key: string){
    return await hgetallAsync(key);
}

export async function getFromList(key: string, fromId: number, toId: number){
    return await lrangeAsync(key, fromId, toId);
}

export async function initializeData(){
    try{
        await createEvent(1, "Kabaret Moralnego Niepokoju");
        await createEvent(2, "Lady Pank");
        await createEvent(3, "Kabaret Neo-Nówka");

        await createSector(1, 1, "Sektor A", 50);
        await createSector(1, 2, "Sektor B", 45);
        await createSector(1, 3, "Sektor C", 70);
        await createSector(2, 1, "Sektor Lewy", 30);
        await createSector(2, 2, "Sektor Prawy", 50);

        await setPlace(1, 1, 3, "abc123");
        await setPlace(1, 1, 4, "abc123");
        await setPlace(1, 1, 7, "xyz123");
        await setPlace(1, 1, 30, "qwe321");

    }catch (e) {
        console.log(e);
    }

}