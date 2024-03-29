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

export async function getPayment(id) {
  const res = await mercadopago.payment.findById(id);

  return res;
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
        success: "https://ecommerce-one-fawn.vercel.app/thanks",
        failure: "https://ecommerce-one-fawn.vercel.app/error-compra",
      },
      metadata: { userId },
      external_reference: order.id,
      notification_url:
        "https://backend-ecommerce-virid.vercel.app/api/ipn/mercadopago",
      auto_return: "approved",
    });

    return preference;
  } catch (error) {
    const preference = null;
    return preference;
  }
}
