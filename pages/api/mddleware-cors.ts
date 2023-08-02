import { rejects } from "assert";
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "GET", "HEAD", "PATCH", "DELETE"],
});

export default function corsMiddleware(req, res, callback) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      callback(req, res);
      return resolve(result);
    });
  });
}
