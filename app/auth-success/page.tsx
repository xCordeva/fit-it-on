"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function AuthSuccessPage() {
  useEffect(() => {
    async function sendUserDataToExtension() {
      try {
        if (window.chrome?.runtime) {
          // Wait for session to be fully established
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts) {
            try {
              const response = await fetch("/api/user", {
                credentials: "include",
              });

              if (response.ok) {
                const userData = await response.json();

                // Send user data to extension
                chrome.runtime.sendMessage(
                  "kbeelmjkolnikchmjfioomnmnmdemidd",
                  {
                    type: "LOGIN_SUCCESS",
                    userData: userData,
                  },
                  (response: any) => {}
                );
                return; // Success, exit the function
              } else {
                attempts++;
                if (attempts < maxAttempts) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }
              }
            } catch (fetchError) {
              attempts++;
              if (attempts < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
          }

          // If we get here, all attempts failed
          // Fallback to just sending login success message
          chrome.runtime.sendMessage(
            "kbeelmjkolnikchmjfioomnmnmdemidd",
            { type: "LOGIN_SUCCESS" },
            (response: any) => {}
          );
        }
      } catch (err) {
        // Fallback to just sending login success message
        try {
          if (window.chrome?.runtime) {
            chrome.runtime.sendMessage(
              "kbeelmjkolnikchmjfioomnmnmdemidd",
              { type: "LOGIN_SUCCESS" },
              (response: any) => {}
            );
          }
        } catch (fallbackErr) {}
      }
    }

    sendUserDataToExtension();
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
