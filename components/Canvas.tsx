"use client";

import { useState } from "react";
import { TryOnForm } from "@/components/TryOnForm";
import { TryOnResult } from "@/components/TryOnResult";
import { useModalStore } from "@/stores/useModalStore";
import { BsInfoCircleFill } from "react-icons/bs";

export default function Canvas() {
  const [result, setResult] = useState<string[] | null>(null);

  const handleResult = (newResult: string[]) => {
    setResult(newResult);
  };

  const handleReset = () => {
    setResult(null);
  };
  const { setShowUploadGuideModal } = useModalStore();
  return (
    <main
      className={`
  md:border-2 bg-[#f2f2f2] md:bg-white md:shadow-xl rounded-lg w-full h-full 
  ${result ? "" : "mb-16"} md:mb-0 
  pb-12 md:pb-0 
  flex justify-center 
  p-4 md:py-10 overflow-auto

`}
    >
      {!result ? (
        <>
          {/* Try-On Form */}
          <div className="w-full max-w-4xl mx-auto">
            <TryOnForm onResult={handleResult} />
            {/* Quality Notice */}
            <div className="text-center text-sm bg-yellow-100 text-yellow-800 p-2 rounded-lg w-fit mx-auto mt-6">
              <p className="flex items-center justify-center gap-1">
                <BsInfoCircleFill className="h-3 w-3 flex-shrink-0" />
                To get the best results, check our upload guide.
              </p>
              <div className="text-center">
                <button
                  className="text-yellow-900 underline cursor-pointer"
                  onClick={() => setShowUploadGuideModal(true)}
                >
                  Upload guide
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Results Section */
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Your Virtual Try-On Result
            </h1>
            <p className="text-gray-600">
              Here's how the outfit looks on you! Download, share, or try
              another combination.
            </p>
          </div>
          <TryOnResult result={result} onReset={handleReset} />
        </div>
      )}
    </main>
  );
}
