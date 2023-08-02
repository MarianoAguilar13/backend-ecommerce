import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { verificarOrderStatus } from "controllers/order";
import corsMiddleware from "../../mddleware-cors";

//con esta funcion del webhook lo que hace, es recibir el post que envia
//mercadopago cuando se modifica la preference y cuando el topic
//sea mechant_order, significa que se pago y salio todo ok
//si se pago vamos a actualizar la preference nuevamente en la db
//con los datos nuevos
async function mercadopago(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    console.log(order);

    await verificarOrderStatus(order);
    res.send("ok");
  } else {
    res.send("ok");
  }
}

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, mercadopago);
};

export default corsHandler;
