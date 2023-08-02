import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_TOKEN,
});

//solo exponemos algunas funciones de mercadopago, no hay que permitir
//enviar todo lo de mercadopago, sino las funciones que necesitemos
export async function getMerchantOrder(id) {
  //el merchant order tiene toda la informacion de la orden creada
  const res = await mercadopago.merchant_orders.get(id);

  return res;
}

export async function createPreference(data = {}) {
  const res = await mercadopago.preferences.create(data);
  return res.body;
}

export async function createAndReturnPreference(
  product,
  aditionalInfo,
  userId,
  order
) {
  try {
    const preference = await createPreference({
      items: [
        {
          title: product.object.Name,
          description: product.object.Description,
          picture_url: "http://www.myapp.com/myimage.jpg",
          category_id: product.object.Type,
          quantity: aditionalInfo.cantidad,
          currency_id: "ARS",
          unit_price: product.object.UnitCost,
        },
      ],
      //la url donde va a volver el usuario
      back_urls: {
        success: "http://localhost:3000/",
        pending: "",
      },
      metadata: { userId },
      external_reference: order.id,
      notification_url:
        "https://webhook.site/0e61697d-5bc8-489c-9aa2-9b05ffa4e1b0",
    });

    return preference;
  } catch (error) {
    const preference = null;
    return preference;
  }
}
