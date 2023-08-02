import { User } from "models/users";
import { Auth } from "models/auth";
import addMinutes from "date-fns/addMinutes";
import { sgMail } from "lib/sendGrid";

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//este controller lo que hace es encontrar el auth con el email
//sino lo encuentra, crea un usuario con ese mail y despues crea el auth
//por ultimo devuelve el auth, todo con el modelo creado de auth y user
export async function findOrCreateAuth(email: string) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  const auth = await Auth.findByEmail(cleanEmail);
  if (auth) {
    return auth;
  } else {
    const newUser = await User.createNewUser({
      email: cleanEmail,
    });
    const newAuth = await Auth.createNewAuth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: new Date(),
    });
    return newAuth;
  }
}

//esta funcion encuentra o crea un nuevo auth y si lo crea
//tambien crea el user, despues le agrega un codigo y una fecha de
//expiracion y sube los cambios a la db
export async function sendCode(email: string) {
  const auth = await findOrCreateAuth(email);
  const code = getRandomIntInclusive(10000, 99999);

  const now = new Date();
  const twentyMinutesFromNow = addMinutes(now, 20);
  auth.data.code = code;
  auth.data.expires = twentyMinutesFromNow;
  await auth.push();

  const texto =
    "Su codigo para ingresar es: " +
    code +
    ".<br> Fecha de expiración del código: " +
    auth.data.expires +
    ".<br> Gracias por visitarnos ";
  const resSendMail = await enviarMail(auth.data.email, texto);
  return resSendMail;
}

export async function enviarMail(mailUser: string, texto: string) {
  try {
    const msg = {
      to: mailUser, // A quien va dirigido el correo
      from: "marianokuro@gmail.com", // Quien envia el correo (tiene que ser un sender verificado dentro de mi Sendgrid)
      subject: "Mascotas perdidas",
      text: "hola",
      html: "<strong>" + texto + "</strong>",
    };
    const mensaje = await sgMail.send(msg);

    return { mensaje, message: "Mensaje enviado" };
  } catch (error) {
    return { error: error.message };
  }
}

//aca chequeo que este bien el email y cod con el auth que esta en la db
//y tambien que la fecha de expiracion sea mayor que la actual
export async function checkCodeMail(email: string, code: string) {
  const auth = await findOrCreateAuth(email);
  const codeNum = parseInt(code, 10);
  const now = new Date();
  //la fecha te la trae en un tipo de dato timestamp
  //para convertirla data, hay que multiplicar los seconds por 1000
  //y hacer un newDate
  const expiresSec = auth.data.expires._seconds * 1000;
  const expiresDate = new Date(expiresSec);

  if (auth.data.email == email && auth.data.code == codeNum) {
    if (now < expiresDate) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
