import { authMiddleware } from "controllers/endpointMiddleware";
import methods from "micro-method-router";
import { OnePatchHandler } from "controllers/user";
import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../mddleware-cors";

const handler = methods({
  patch: OnePatchHandler,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, authMiddleware(handler));
};

export default corsHandler;
