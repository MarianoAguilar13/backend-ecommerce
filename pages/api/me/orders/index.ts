import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "controllers/endpointMiddleware";
import { getOrdersByUserId } from "controllers/order";
import corsMiddleware from "../../mddleware-cors";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { userId } = token;
  const orders = await getOrdersByUserId(userId);

  if (!orders) {
    res
      .status(404)
      .json({ message: "El usuario no realizo ordenes de compra" });
  } else {
    res.send({ orders });
  }
}

const handler = methods({
  get: getHandler,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, authMiddleware(handler));
};

export default corsHandler;
