"use client";
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
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🎉 You’re now signed in!</h1>
      <p>You can go back to the extension and continue where you left off.</p>
    </div>
  );
}
