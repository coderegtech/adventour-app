"use client";

import PaymentCom from "./PaymentCom";

export default function GcashPayment(props) {
  return <PaymentCom {...props} method="gcash" />;
}
