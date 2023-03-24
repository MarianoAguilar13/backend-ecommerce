import { firestore } from "../lib/firestore";

const collection = firestore.collection("auth");

export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;

  constructor(id) {
    this.ref = collection.doc(id);
  }
  //trar la data
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  //pushea la data y hace un update
  async push() {
    this.ref.update(this.data);
  }
  //el static, crea una instacia de esta clase Auth
  //busco hay un auth con ese mail, si lo encuentra,
  //retorna el auth y sino null
  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }
  //crea un nuevo auth con la data enviada por parametro
  static async createNewAuth(data) {
    //ese snap es una reference
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }
}
