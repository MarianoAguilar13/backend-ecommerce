import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import * as yup from "yup";

let bodySchema = yup.object().shape({
  email: yup.string().email().required(),
});

//el noUnknown, evita que nos pasen algo adicional de lo que definimos
//en el schema
/*
let bodySchema = yup.object().shape({
  email: yup.string().required(),
}).noUnknown(true).strict;
*/

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    //chequeando el req y req.body
    try {
      await bodySchema.validate(req.body);
      const response = await sendCode(req.body.email);
      if (response.mensaje) {
        res.send({ message: response.message });
      } else {
        res.send({ error: response.error });
      }
    } catch (error) {
      res.send({
        message:
          "Faltan datos en el body que son necesarios para la llamada a la api",
        error,
      });
    }
  },
});
