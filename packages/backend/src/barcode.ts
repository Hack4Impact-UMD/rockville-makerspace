import { randomInt } from "node:crypto";
import { getFirestore } from "firebase-admin/firestore";
import { COLLECTIONS} from "@repo/common";
import bwipjs from "bwip-js/node";

const ALLCHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


export function generateBarcode(): string {

    let barcode = "";

    for(let i=0; i<11; i++)
    {
        barcode += ALLCHARACTERS[randomInt(ALLCHARACTERS.length)];
    }

    return barcode;
}

export function assignBarcode(personId: string): Promise<string> {
  const db = getFirestore();

  return db.runTransaction(async (transaction) => {
    
    const personRef = db.collection(COLLECTIONS.people).doc(personId);
    const personData = await transaction.get(personRef);

    //Check for existence
    if(!personData.exists)
    {
        throw new Error(`Person ${personId} does not exist`);
    }

    const person = personData.data();

    //Check for if they're a member
    if(!person?.membership)
    {
        throw new Error(`Person ${personId} is not a member`);
    }

    //Check if they have a barcode already
    if(person.membership.barcode)
    {
        return person.membership.barcode;
    }

    const barcode = generateBarcode(); //generate new barcode
    const existingBarcode = db
    .collection(COLLECTIONS.people)
    .where("membership.barcode", "==", barcode);

    //check if same as another
    const barcodeExists = await transaction.get(existingBarcode);

    if(!barcodeExists.empty)
    {
      throw new Error(`Generated barcode ${barcode} is already in use`);  
    }

    //Update the info into firebase
    transaction.update(personRef, { "membership.barcode": barcode });
    
    return barcode;

  });

}

//Code 128 SVG with the code printed under the bars
export function barcodeSvg(code: string): string {
  return bwipjs.toSVG({
    bcid: "code128",
    text: code,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: "center",
  });
}

//Code 128 PNG
export function barcodePng(code: string): Promise<Buffer> {
  return bwipjs.toBuffer({
    bcid: "code128",
    text: code,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: "center",
  });
}