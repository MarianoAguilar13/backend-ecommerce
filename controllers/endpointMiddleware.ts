import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decodeJwt } from "lib/jwt";
import { User } from "models/users";

//el middleware recive un handler si todo sale bien
//y el middleware retorna una funcion para que vercel
//ejecute esa funcion como endPoint
export function authMiddleware(callback) {
  //esta funcion es la que va a retornar y la que realmente va
  //a tomar vercel
  return function (req: NextApiRequest, res: NextApiResponse) {
    //se cheque que exista el token, sino existe mandamos la res
    const token = parseToken(req);
    if (!token) {
      res.status(401).send({ message: "no se encontro el token" });
    }

    const decoded = decodeJwt(token);

    //decodeamos el token y si se pudo decodear, entonces ejecutamos el handler
    if (decoded) {
      callback(req, res, decoded);
    } else {
      res.status(401).send({ message: "token incorrecto" });
    }
  };
}
