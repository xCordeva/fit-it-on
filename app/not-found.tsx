"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-white px-4">
      <img src={"/logo.png"} alt="fititon=logo" className="h-15 w-auto mb-10" />
      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800">404</h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-600">
        Oops! Looks like you’ve lost your way.
      </p>
      <p className="mt-2 text-md text-gray-500">
        The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => router.back()}
        className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition cursor-pointer"
      >
        Go Back
      </button>
    </main>
  );
}
