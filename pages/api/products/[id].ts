import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "controllers/product";
import * as yup from "yup";

let querySchema = yup
  .object()
  .shape({
    id: yup.string().min(10),
  })
  .noUnknown(true)
  .strict();

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);

      const { id } = req.query;

      const product = await getProductById(id as string);
      //si la data existe le paso el product(data) y sino le tiro un msj de error
      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404).send({ message: "No se encontro el producto" });
      }
    } catch (error) {
      res.send({
        message: "No se encuentra el param id o tiene pocos caracteres",
        error,
      });
    }
  },
});
