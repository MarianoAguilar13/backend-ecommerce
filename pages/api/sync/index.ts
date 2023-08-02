import { syncAirtableAlgolia } from "controllers/sync";
import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../mddleware-cors";

async function sync(req: NextApiRequest, res: NextApiResponse) {
  //const { offset, limit } = getOffsetAndLimitFromReq(req, 100, 20);

  syncAirtableAlgolia(req, res);
}

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, sync);
};

export default corsHandler;
