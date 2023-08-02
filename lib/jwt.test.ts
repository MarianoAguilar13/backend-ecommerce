import { generateJwt, decodeJwt } from "./jwt";
import test from "ava";

test("jwt", (t) => {
  const entrada = { name: "Mariano" };
  const token = generateJwt(entrada);
  const salida = decodeJwt(token) as any;
  delete salida.iat;

  t.deepEqual(entrada, salida);
});
