import { firestore } from "../lib/firestore";

const collection = firestore.collection("orders");

/* 
data:{
    productId: 
    cantidad:
    preferenseId:
    userId:
}
*/

export class Order {
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

  //crea un nuevo usuario con la data enviada por parametro
  //luego retorna el usuario generado
  static async createNewOrder(data) {
    //ese snap es una reference
    const newOrderSnap = await collection.add(data);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = data;
    return newOrder;
  }
}
