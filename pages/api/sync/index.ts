import { syncAirtableAlgolia } from "controllers/sync";
import type { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest, res: NextApiResponse) {
  //const { offset, limit } = getOffsetAndLimitFromReq(req, 100, 20);

  syncAirtableAlgolia(req, res);
}
