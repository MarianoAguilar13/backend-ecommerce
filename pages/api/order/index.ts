import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "controllers/endpointMiddleware";
import { getProductById } from "controllers/product";
import { createAndReturnOrder } from "controllers/order";
import { createAndReturnPreference } from "lib/mercadopago";
import * as yup from "yup";
import corsMiddleware from "../mddleware-cors";

//la data opcional del product la envio por el body
/*
{
  "color": "negro",
  "direccion_de_envio":"calle falsa 1234"
}

*/

let querySchema = yup
  .object()
  .shape({
    productId: yup.string().min(10).required(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    await querySchema.validate(req.query);

    const { productId } = req.query as any;
    const aditionalInfo = req.body;
    const { userId } = token;
    const product = await getProductById(productId);
    //o me trae el product si existe y sino produc=null
    if (!product) {
      res.status(404).json({ message: "El producto no existe" });
    } else {
      //aca creo una order con la data
      const order = await createAndReturnOrder(
        aditionalInfo,
        productId,
        userId
      );

      const preference = await createAndReturnPreference(
        product,
        aditionalInfo,
        userId,
        order
      );

      if (preference) {
        res.send({ url: preference.sandbox_init_point });
      } else {
        res.send({ error: "Ocurrio un error en la creación de la preference" });
      }
    }
  } catch (error) {
    res.send({
      message: "Falta el productId en la query o tiene pocos caracteres",
      error,
    });
  }
}

const handler = methods({
  post: postHandler,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, authMiddleware(handler));
};

export default corsHandler;
