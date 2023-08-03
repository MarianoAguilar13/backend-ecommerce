import { Order } from "models/orders";
import { firestore } from "../lib/firestore";
import { getMerchantOrder } from "lib/mercadopago";

const collection = firestore.collection("orders");

export async function createAndReturnOrder(aditionalInfo, productId, userId) {
  const order = await Order.createNewOrder({
    aditionalInfo,
    productId,
    userId,
    status: "pending",
    crateDate: new Date(),
  });

  return order;
}

//esta funcion nos permite crear una order y retornar el id de la misma
export async function crearOrderReturnId() {
  const newOrder = await Order.createNewOrder({});

  return newOrder.id;
}

//con esta funcion actualizo la data de la order que tenga el id envia por parametro
export async function actualizarDataOrder(id, data) {
  const newOrder = new Order(id);
  newOrder.data = data;
  await newOrder.push();
}

//verifica el order status y si esta paid entonces actualizo
//la data de la order en la db
export async function verificarOrderStatus(order) {
  //el merchant order tiene toda la informacion de la orden creada

  //  console.log("el orden status es: ", order.order_status);

  /*
  if (order.response.order_status == "paid") {
    const orderId = order.response.external_reference;
    const myOrder = new Order(orderId);
    await myOrder.pull();
    myOrder.data.status = "closed";
    await myOrder.push();
    //enviar el email que el pago fue realizado
  }
}
  */

  if (order.order_status === "paid") {
    console.log("se realizo el pago");

    const orderId = order.external_reference;
    const myOrder = new Order(orderId);
    await myOrder.pull();
    myOrder.data.status = "closed";
    await myOrder.push();
    //enviar el email que el pago fue realizado
  }
}

export async function verificarPago(pago) {
  if (pago.status == "approved") {
    console.log("se realizo el pago");

    const orderId = pago.external_reference;
    const myOrder = new Order(orderId);
    await myOrder.pull();
    myOrder.data.status = "closed";
    await myOrder.push();
    //enviar el email que el pago fue realizado
  }
}

//esta funcion se encarga de obtener las ordenes de un usuario
export async function getOrdersByUserId(userId) {
  try {
    //busco en cuales ordenes esta el userId
    const ordersSnap = await collection.where("userId", "==", userId).get();

    let ordersId = [];
    //por cada order encontrada, le extraigo el id y lo guardo en un array para recorrerlo
    //ya que la data no se lee bien como esta
    ordersSnap.docs.forEach((doc) => {
      ordersId.push({ id: doc.id });
    });

    let dataOrders = [];
    //ahora con las id obtenidas, lo que hago es pedir la data de cada order
    //y ahora esta bien estructurada la data para ser consumida por el front
    for (const order of ordersId) {
      const myOrder = new Order(order.id);
      await myOrder.pull();
      dataOrders.push(myOrder.data);
    }

    return dataOrders;
  } catch (error) {
    const ordersSnap = null;
    return ordersSnap;
  }
}
