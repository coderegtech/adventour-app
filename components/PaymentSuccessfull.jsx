"use client";

import Link from "next/link";

export default function PaymentSuccessfull({ amount, name, bookingId }) {
  return (
    <section className="min-h-screen bg-white flex flex-col justify-center items-center p-6 space-y-4">
      <h1 className="text-xl font-semibold">Demo booking saved</h1>
      <p>Your booking for {name} is pending. Payment was simulated; no money was charged.</p>
      <p>Demo amount: ?{Number(amount).toLocaleString()}</p>
      <p className="break-all">Booking ID: {bookingId}</p>
      <Link href="/booking_history" className="text-green-700 underline">View bookings</Link>
      <Link href="/home">Back home</Link>
    </section>
  );
}
