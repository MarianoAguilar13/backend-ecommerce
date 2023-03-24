import type { NextApiRequest, NextApiResponse } from "next";
import { productIndex } from "lib/conection-db-air-alg";

export function getOffsetAndLimitFromReq(
  req: NextApiRequest,
  maxLimit,
  maxOffset
) {
  //aca verifico que el limit sea menor que maxLimit, ya que es el maximo
  //de items que puede pedir en una consulta
  //el offset es a partir de que item va pedir los datos si el offset
  //es mas larga que el array de items, entonces el offset sera 0
  const queryLimit = parseInt(req.query.limit as string);
  const queryOffset = parseInt(req.query.offset as string);
  let limit = 10;
  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    maxLimit;
  }

  const offset = queryOffset < maxOffset ? queryOffset : 0;

  return {
    limit,
    offset,
  };
}

export async function searchQueryProducts(
  query: string,
  offset: number,
  limit: number
) {
  //el mejor metodo de algolia es usar el page y el hitsPerPage
  //con el offset y el limit haremos eso
  //page --> la pagina a la cual estoy pidiendo datos
  //hitsPerPage --> este sera el limit, la cantidad de hits por page
  //ejempro 10 hits por page sera el limit
  //y el offset sera el numero de page
  //tambien se puede utilizar con el offset
  //y el length que sera la cantidad que queremos y ese es el limit

  const algoliaResults = await productIndex.search(query as string, {
    offset: offset,
    length: limit,
  });

  const results = algoliaResults;

  return results;

  //nbHits son la cantidad de items que matcheo pero solo te devuelve
  //depende del limit y offset que se envio en el search de algolia
}

export async function getProductById(id: string) {
  //aca hay que hacer un try-catch, ya que cuando no encuentra el objeto
  //por pasarle un id que no es tira un error y hay que atraparlo con el catch
  //si esta todo ok le paso la data del product y sino setteo la data en null
  try {
    const dataProduct = (await productIndex.findObject(
      (hit) => hit.objectID == id
    )) as any;

    //elimino algunas propiedades que no necesito
    delete dataProduct.object._highlightResult;

    return dataProduct;
  } catch (error) {
    const dataProduct = null;

    return dataProduct;
  }
}
