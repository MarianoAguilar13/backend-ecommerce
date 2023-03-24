import { authMiddleware } from "controllers/endpointMiddleware";
import methods from "micro-method-router";
import { OnePatchHandler } from "controllers/user";

const handler = methods({
  patch: OnePatchHandler,
});

export default authMiddleware(handler);
