"use client";

import PaymentCom from "./PaymentCom";

export default function CardPayment(props) {
  return <PaymentCom {...props} method="card" />;
}
