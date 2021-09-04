import {removePlace, setPlace} from '../models/place';

export const createPlace = async (req: any, res: any) => {
    try{
        await setPlace(req.params.eventId, req.params.sectorId, req.body.placeId, req.body.clientId);
        res.status(200);
        res.send("Place set!");
    } catch (e) {
        res.status(404);
        res.send(e.message);
    }
};

export const deletePlace = async (req: any, res: any) => {
    try{
        await removePlace(req.params.eventId, req.params.sectorId, req.params.placeId);
        res.status(200);
        res.send("Place removed!");
    } catch (e) {
        res.status(404);
        res.send(e.message);
    }
};