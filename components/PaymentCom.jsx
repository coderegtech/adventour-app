"use client";

import { useRef, useState } from "react";
import { addBooking } from "../config/hooks";
import PaymentSuccessfull from "./PaymentSuccessfull";

const PaymentCom = ({ method, formdata, data, back }) => {
  const submitting = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const submit = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setIsLoading(true);
    setError("");
    try {
      const response = await addBooking(formdata, method);
      setBooking(response.data);
    } catch (error) {
      setError(error.message || "Unable to save booking. Please retry.");
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };

  if (booking) return <PaymentSuccessfull amount={booking.bookingPrice} name={data.name} bookingId={booking.id} />;

  return (
    <section className="min-h-screen bg-white p-6 space-y-6">
      <button type="button" onClick={back} disabled={isLoading}>Back to booking</button>
      <h1 className="text-2xl font-semibold">{method === "card" ? "Card" : "GCash"} payment demo</h1>
      <p>No money will be charged. Do not enter card numbers, CVVs, or payment credentials. This saves a pending booking and a simulated payment only.</p>
      <h2 className="font-semibold">{data.name}</h2>
      <p>{formdata.startDate} – {formdata.endDate}</p>
      {formdata.package && <p>Package: {formdata.package}</p>}
      <p>Estimated total: ₱{Number(formdata.bookingPrice).toLocaleString()}. Final demo amount is calculated from the catalog by the server.</p>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button type="button" disabled={isLoading} onClick={submit} className="rounded-lg bg-green-600 p-3 text-white disabled:opacity-50">
        {isLoading ? "Saving…" : "Save demo booking"}
      </button>
    </section>
  );
};

export default PaymentCom;
