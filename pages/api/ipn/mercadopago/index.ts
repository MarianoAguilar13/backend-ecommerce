import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder, getPayment } from "lib/mercadopago";
import { verificarOrderStatus, verificarPago } from "controllers/order";
import corsMiddleware from "../../mddleware-cors";

//con esta funcion del webhook lo que hace, es recibir el post que envia
//mercadopago cuando se modifica la preference y cuando el topic
//sea mechant_order, significa que se pago y salio todo ok
//si se pago vamos a actualizar la preference nuevamente en la db
//con los datos nuevos
async function mercadopago(req: NextApiRequest, res: NextApiResponse) {
  // const { id, topic, type } = req.query;
  const payment = req.query;
  if (payment.topic == "merchant_order") {
    const order = await getMerchantOrder(payment.id);
    console.log("esta es la order:", order);

    await verificarOrderStatus(order);
    res.send("ok");
  } else {
    if (payment.type == "payment") {
      try {
        const data = await getPayment(payment["data.id"]);

        console.log("esta es la data del pago:  ", data.response);

        await verificarPago(data);
      } catch (error) {
        console.log(error);

        return res.send("todo mal");
      }
    }
    res.send("ok");
  }
}

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, mercadopago);
};

export default corsHandler;
