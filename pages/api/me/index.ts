import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "controllers/endpointMiddleware";
import methods from "micro-method-router";
import { getHandler } from "controllers/user";
import { patchHandler } from "controllers/user";
import corsMiddleware from "../mddleware-cors";

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, authMiddleware(handler));
};

export default corsHandler;
