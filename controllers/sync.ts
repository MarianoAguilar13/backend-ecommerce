import { baseAirtable } from "lib/conection-db-air-alg";
import { productIndex } from "lib/conection-db-air-alg";
import type { NextApiRequest, NextApiResponse } from "next";

export function syncAirtableAlgolia(req: NextApiRequest, res: NextApiResponse) {
  baseAirtable("Furniture")
    .select({
      pageSize: 10,
    })
    .eachPage(
      async function (records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });
        await productIndex.saveObjects(objects);
        console.log("página");
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        res.json("terminó");
      }
    );
}
