import {getEvent, getEvents} from "../models/event";
import {getSector, getSectors} from "../models/sector";
import {getPlaces} from "../models/place";

export const index = async (req: any, res: any) => {
    const events = await getEvents(0, 10)

    res.render("events", { events });
};

export const eventDetails = async (req: any, res: any) => {
    const eventId = req.params.eventId;
    const event = await getEvent(eventId);
    const sectors = await getSectors(eventId, 0, 10)

    res.render("events/event", { event, sectors });
};

export const sectorDetails = async (req: any, res: any) => {
    const eventId = req.params.eventId;
    const sectorId = req.params.sectorId;

    const event = await getEvent(eventId);
    const sector = await getSector(eventId, sectorId);
    const places = await getPlaces(eventId, sectorId, 0, -1);

    const numberOfColumns = 8;
    const clientId = "abc123";

    res.render("events/sector", { event, sector, places, numberOfColumns, clientId });
};