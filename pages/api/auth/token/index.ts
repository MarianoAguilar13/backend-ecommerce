import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import methods from "micro-method-router";
import { checkCodeMail } from "controllers/auth";
import { getUserId } from "controllers/user";
import * as yup from "yup";
import corsMiddleware from "../../mddleware-cors";

let bodySchema = yup.object().shape({
  email: yup.string().email().required(),
  code: yup.string().required(),
});

async function token(req: NextApiRequest, res: NextApiResponse) {
  try {
    await bodySchema.validate(req.body);

    const { email, code } = req.body;

    //result contiene true o false, ya que cheque que el email y el code
    //sean correctos
    const result = await checkCodeMail(email, code);

    //si es true, creo el token y lo respondo, caso contrario respondo con el error
    if (result) {
      const user = await getUserId(email);
      var token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.send({ token });
    } else {
      res.status(401).send({
        message:
          "Algunos o todos los datos ingresados (email o código) son incorrectos o la fecha del código vencio.",
      });
    }
  } catch (error) {
    res.send({
      message:
        "Faltan datos en el body que son necesarios para la llamada a la api",
      error,
    });
  }
}

const handler = methods({
  post: token,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, handler);
};

export default corsHandler;
