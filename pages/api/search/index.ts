import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOffsetAndLimitFromReq } from "controllers/product";
import { searchQueryProducts } from "controllers/product";
import * as yup from "yup";
import corsMiddleware from "../mddleware-cors";

let querySchema = yup
  .object()
  .shape({
    query: yup.string().required().nonNullable(),
    offset: yup.number().integer().moreThan(-1),
    limit: yup.number().integer().positive(),
  })
  .noUnknown(true)
  .strict();

async function search(req: NextApiRequest, res: NextApiResponse) {
  const { offset, limit } = getOffsetAndLimitFromReq(req, 100, 20);
  //aca estamos creando otro array con la cantidad de items que se
  //ha requerido con limit y offset
  //primero parametro, a partir desde donde y hasta donde quiero copiar el array
  // const sliced = lista.slice(offset, offset + limit);

  const objQuery = {
    query: req.query.query,
    limit: parseInt(req.query.limit as string),
    offset: parseInt(req.query.offset as string),
  };

  try {
    await querySchema.validate(objQuery);

    const query = req.query.query as string;

    const results = await searchQueryProducts(query, offset, limit);
    //nbHits son la cantidad de items que matcheo pero solo te devuelve
    //depende del limit y offset que se envio en el search de algolia

    if (results.hits[0]) {
      res.status(200).send({
        results: results.hits,
        pagination: {
          offset,
          limit,
          total: results.nbHits,
        },
      });
    } else {
      res.status(404).send({
        message: "No hay productos que correspondan con su busqueda",
      });
    }
  } catch (error) {
    res.send({
      message:
        "Algunos de las query params no se enviaron correctamente (query, limit u offset)",
      error,
    });
  }
}

const handler = methods({
  get: search,
});

const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await corsMiddleware(req, res, handler);
};

export default corsHandler;
