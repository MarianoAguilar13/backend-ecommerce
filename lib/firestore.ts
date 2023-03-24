import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);

//en next y vercel, no es como express que se ejecuta todo una sola
//vez cuando se inicializa la api y luego exporta el resultado que se
//ejecuto por primera vez cada vez que lo usas en algun endpoint,
//en cambio vercel y next ejecutan la funcion o modulo cada vez
//que es invocado, generando asi complicaciones por ej en la inicializacion
//de la coneccion a la db

//preguntamos si es 0 y si es entonces entra porque al negar el false
//queda true y entra, porque si es 0 significa que nunca fue invocado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
export { firestore };
