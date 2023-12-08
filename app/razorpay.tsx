"use client";

import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import useRazorpay, { RazorpayOptions } from "react-razorpay";

const RAZOR_API_KEY = "rzp_test_c4bTc9bMwdE8xe";

export const RazorPay = () => {
  const [Razorpay] = useRazorpay();

  const handlePayment = useCallback(async () => {
    const res = await fetch(`/order`, {
      method: "POST",
      body: JSON.stringify({
        amount: 3000,
        currency: "INR",
      }),
    });

    const resJson = await res.json();
    console.log(resJson);

    // const order = await createOrder(params);
    const order = { id: resJson.orderId };

    const options: RazorpayOptions = {
      key: RAZOR_API_KEY,
      amount: "3000",
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      //   image: "https://example.com/your_logo",
      order_id: order.id,
      handler: (res) => {
        console.log(res);
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);

  return (
    <div className="w-full">
      <Button
        className="w-full"
        variant="outline"
        size="lg"
        onClick={handlePayment}
      >
        Razer Pay
      </Button>
    </div>
  );
};
