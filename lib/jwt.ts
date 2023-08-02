import jwt from "jsonwebtoken";

export function generateJwt(obj) {
  return jwt.sign(obj, process.env.JWT_SECRET);
}

export function decodeJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    console.error("token invalido");
    return null;
  }
}
