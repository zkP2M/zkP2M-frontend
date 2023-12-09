import RazorPay from "razorpay";

const KEY_ID = "rzp_test_c4bTc9bMwdE8xe";
const KEY_SECRET = "Eh6iHh3OyK7MTWFAljNXgHPS";

const instance = new RazorPay({ key_id: KEY_ID, key_secret: KEY_SECRET });

export async function POST(request: Request) {
  // get req body
  const body = await request.json();

  const order = await instance.orders.create({
    amount: body.amount,
    currency: body.currency,
    receipt: body.receipt,
    notes: {
      id: body.id,
    },
    // customer_id: body.customer_id,
  });

  return Response.json({ orderId: order.id });
}
