import {randomInt} from "node:crypto";

const ALLCHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


export function generateBarcode(): string {

    let barcode = "";

    for(let i=0; i<11; i++)
    {
        barcode += ALLCHARACTERS[randomInt(ALLCHARACTERS.length)];
    }

    return barcode;
}