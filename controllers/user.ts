import { User } from "models/users";
import { decodeJwt } from "lib/jwt";
import parseToken from "parse-bearer-token";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { sgMail } from "lib/sendGrid";

let bodySchemaOnePatch = yup
  .object()
  .shape({
    direccion: yup.string().min(5),
    tel: yup.string().min(10),
    name: yup.string().min(1),
  })
  .noUnknown(true)
  .strict();

let bodySchemaPatch = yup
  .object()
  .shape({
    direccion: yup.string(),
    tel: yup.string(),
    name: yup.string(),
  })
  .noUnknown(true)
  .strict();

export async function validarTokenDataUser(req: NextApiRequest) {
  //recivo y verifico el token para obtener el id del user
  const token = parseToken(req);
  const decoded = decodeJwt(token) as any;
  const userId = decoded.userId;

  //con ese id creo la instancia de la clase user y hago un pull de la data
  const newUser = new User(userId);
  await newUser.pull();

  const userData = {
    data: newUser.data,
    id: userId,
  };

  return userData;
}

//con el mail del user obtengo su id
export async function getUserId(email: string) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  const user = await User.findByEmail(cleanEmail);
  if (user) {
    return user;
  } else {
    return null;
  }
}

export async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  const user = new User(token.userId);
  await user.pull();
  res.send(user.data);
}

/*
type userType = {
  userId: string;
  email: string;
  direccion: string;
  tel: string;
  name: string;
};*/

export async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  try {
    await bodySchemaPatch.validate(req.body);
    const newData = req.body;

    //me traigo la data del user
    const user = new User(token.userId);
    await user.pull();

    //me fijo que datos enviados por el body, voy a actualizar en el user
    newData.direccion
      ? (user.data.direccion = newData.direccion)
      : (user.data = user.data);
    newData.tel ? (user.data.tel = newData.tel) : (user.data = user.data);
    newData.name ? (user.data.name = newData.name) : (user.data = user.data);

    //una vez reemplazados por los nuevos valores, pushheo los cambios
    await user.push();
    res.send({ message: "Los datos han sido actualizados" });
  } catch (error) {
    res.send({
      message: "El body tienen datos de más",
      error,
    });
  }
}

export async function OnePatchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  try {
    await bodySchemaOnePatch.validate(req.body);

    const { address } = req.query;

    const user = new User(token.userId);
    await user.pull();

    address == "direccion"
      ? (user.data.direccion = req.body.direccion)
      : (user.data = user.data);
    address == "tel" ? (user.data.tel = req.body.tel) : (user.data = user.data);
    address == "name"
      ? (user.data.name = req.body.name)
      : (user.data = user.data);

    await user.push();
    res.send({ message: "Los datos han sido actualizados" });
  } catch (error) {
    res.send({
      message: "El query y/o body, le faltan o tienen datos de más",
      error,
    });
  }
}

export async function enviarMailDeAviso(mailUser: string, texto: string) {
  try {
    const msg = {
      to: mailUser, // A quien va dirigido el correo
      from: "marianokuro@gmail.com", // Quien envia el correo (tiene que ser un sender verificado dentro de mi Sendgrid)
      subject: "E-commerce",
      text: "Hola",
      html: "<strong>" + texto + "</strong>",
    };
    const mensaje = await sgMail.send(msg);

    return { mensaje, message: "Mensaje enviado" };
  } catch (error) {
    return { error: error.message };
  }
}
