import { randomInt } from "node:crypto";
import { getFirestore } from "firebase-admin/firestore";
import { COLLECTIONS} from "@repo/common";

const ALLCHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


export function generateBarcode(): string {

    let barcode = "";

    for(let i=0; i<11; i++)
    {
        barcode += ALLCHARACTERS[randomInt(ALLCHARACTERS.length)];
    }

    return barcode;
}

export async function assignBarcode(personId: string): Promise<string> {
  const db = getFirestore();

  return db.runTransaction(async (transaction) => {
    
    const personRef = db.collection(COLLECTIONS.people).doc(personId);
    const personData = await transaction.get(personRef);

    //Check for existance
    if(!personData.exists)
    {
        throw new Error(`Person ${personId} does not exist`);
    }

    const person = personData.data();

    //Check for if theyre a member
    if(!person?.membership)
    {
        throw new Error(`Person ${personId} is not a member`);
    }

    //Check if they have a barcode already
    if(person.member.barcode)
    {
        return person.membership.barcode;
    }

    const barcode = generateBarcode(); //generate new barcode
    const existingBarcode = db
    .collection(COLLECTIONS.people)
    .where("membership.barcode", "==", barcode);

    //check if same as anotehr
    const barcodeExists = await transaction.get(existingBarcode);

    if(!barcodeExists.empty)
    {
      throw new Error(`Generated barcode ${barcode} is already in use`);  
    }

    //ToDo: Update the info into firebase and the barcodeSvg() and Png functions
    
    return barcode;

  });
}