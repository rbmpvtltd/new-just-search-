"use client"

import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

const PaymentButton = ({className , style, title,identifier }:{className:string, style:object, title: string, identifier:string}) => {
  const trpc = useTRPC()
 const {mutate} = useMutation(trpc.subscriptionRouter.create.mutationOptions())

  const handlePayment = (subscription_id:string) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID, // Replace with your Razorpay key ID
      subscription_id, // Replace with your subscription ID
      name: "Acme Corp.",
      description: "Monthly Test Plan",
      image: "/your_logo.jpg", // URL of your logo
      // callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
     	handler: (response: RazorpayPaymentResponse) => {
					alert(response.razorpay_payment_id);
					alert(response.razorpay_subscription_id);
					alert(response.razorpay_signature);
			},
      // prefill: {
      //   name: "<name>",
      //   email: "<email>",
      //   contact: "<phone>"
      // },
      // notes: {
      //   note_key_1: "Tea. Earl Grey. Hot",
      //   note_key_2: "Make it so."
      // },
      theme: {
        color: "#fdd317ff"
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };


  const createSubscription = () => {
    mutate({
      identifier
    },
    {
      onSuccess:(data) => {
        handlePayment(data.response.id)

      },
      onError: (error) => {
        console.log("Error", error)
      }
    },
  
  )
  } 

  return (
    <button type='button'  onClick={createSubscription} className={className} style={style}>
      {title}
    </button>
  );
};

export default PaymentButton;
