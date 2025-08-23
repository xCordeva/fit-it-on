"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function AuthSuccessPage() {
  useEffect(() => {
    try {
      if (window.chrome?.runtime) {
        chrome.runtime.sendMessage(
          "kbeelmjkolnikchmjfioomnmnmdemidd",
          { type: "LOGIN_SUCCESS" },
          (response: any) => {
            console.log("Extension acknowledged:", response);
          }
        );
      }
    } catch (err) {
      console.error("Unable to send message to extension:", err);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen flex-col text-center p-6">
      <Image
        src="/logo.png"
        height={150}
        width={150}
        alt="Fit it on logo"
        className="mb-8"
      />
      <h1 className="text-3xl font-bold mb-4">🎉 You’re now signed in!</h1>
      <p className="text-lg font-semibold">
        You can safely close this tab and return to the extension to continue
        where you left off.
      </p>
    </div>
  );
}
