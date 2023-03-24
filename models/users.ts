import { firestore } from "../lib/firestore";

const collection = firestore.collection("users");
//esta clase representa a un user, estamos modelando el user
//el constructor del user y los metodos que va a tener
export class User {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: any;
  //crea la referencia al doc en la db
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  //este metodo pull trae la data de la db
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
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
      const newUser = new User(first.id);
      newUser.data = first.data();
      return newUser;
    } else {
      return null;
    }
  }
  //crea un nuevo usuario con la data enviada por parametro
  //luego retorna el usuario generado
  static async createNewUser(data) {
    //ese snap es una reference
    const newUserSnap = await collection.add(data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
}
