import RazorPay from "razorpay";

const KEY_ID = process.env.KEY_ID as string;
const KEY_SECRET = process.env.KEY_SECRET as string;

const instance = new RazorPay({ key_id: KEY_ID, key_secret: KEY_SECRET });

export async function POST(request: Request) {
  // get req body
  const body = await request.json();

  const order = await instance.orders.create({
    amount: (Number(body.amount) * 100).toFixed(0),
    currency: body.currency,
    notes: {
      id: body.id,
    },
    // customer_id: body.customer_id,
  });

  return Response.json({ orderId: order.id });
}
