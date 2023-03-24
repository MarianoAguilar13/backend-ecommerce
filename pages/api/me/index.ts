import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "controllers/endpointMiddleware";
import methods from "micro-method-router";
import { getHandler } from "controllers/user";
import { patchHandler } from "controllers/user";

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

export default authMiddleware(handler);
