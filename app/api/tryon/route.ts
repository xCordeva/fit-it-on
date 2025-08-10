import { NextResponse } from "next/server";
import {
  uploadBufferToSupabase,
  uploadImageFromUrlToSupabase,
} from "@/lib/tryOnHelpers";

export async function POST(req: any) {
  // Use native request.formData() to handle multipart form data
  try {
    const formData = await req.formData();
    const personImageFile = formData.get("personImage");
    const garmentImageUrl = formData.get("garmentImageUrl");
    const userId = formData.get("userId");

    // Ensure all required fields are present
    if (!personImageFile || !garmentImageUrl) {
      return NextResponse.json(
        { error: "Missing personImage or garmentImageUrl" },
        { status: 400 }
      );
    }

    // Convert the File object to a Buffer
    const personImageBuffer = Buffer.from(await personImageFile.arrayBuffer());

    // Construct path for person image
    const personImageFilePath = `users/${userId}/person/${Date.now()}-${
      personImageFile.name
    }`;

    const modelImageUrl = await uploadBufferToSupabase(
      personImageBuffer,
      personImageFilePath,
      personImageFile.type
    );

    // --- 2. SEND PREDICTION REQUEST TO FASHN API ---
    const runResponse = await fetch(
      `${process.env.NEXT_PUBLIC_FASHN_BASE_URL}/run`,
      {
        method: "POST",
        body: JSON.stringify({
          model_name: "tryon-v1.6",
          inputs: {
            model_image: modelImageUrl,
            garment_image: garmentImageUrl,
            num_samples: 1,
          },
        }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error("FASHN API start error:", errorText);
      throw new Error("Failed to start try-on process with FASHN API");
    }

    const { id: predictionId } = await runResponse.json();

    // --- 3. POLL FASHN API FOR RESULT ---
    let status = "starting";
    let output = [];
    const pollingStartTime = Date.now();
    const pollingTimeout = 60000;

    while (status !== "completed" && status !== "failed") {
      if (Date.now() - pollingStartTime > pollingTimeout) {
        throw new Error("FASHN API polling timed out");
      }
      const statusResponse = await fetch(
        `${process.env.FASHN_BASE_URL}/status/${predictionId}`,
        {
          headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` },
        }
      );
      if (!statusResponse.ok) throw new Error("Failed to fetch try-on status");
      const statusData = await statusResponse.json();
      status = statusData.status;
      if (status === "completed") {
        output = statusData.output;
        break;
      }
      if (status === "failed") {
        throw new Error(statusData.error?.message || "FASHN API failed");
      }
      await new Promise((res) => setTimeout(res, 2500));
    }

    // --- 4. UPLOAD RESULT IMAGES TO SUPABASE ---
    const uploadedResults: string[] = await Promise.all(
      output.map((url: string) =>
        uploadImageFromUrlToSupabase(url, "results", userId)
      )
    );

    // --- 5. DECREMENT TRIAL COUNT ---
    if (!userId.startsWith("anon/")) {
      await fetch(`${req.headers.origin}/api/decrement-trial`, {
        method: "POST",
        credentials: "include", // Pass cookies to authenticate the user
      });
    }

    // --- 6. RETURN FINAL RESULT URL ---
    return NextResponse.json(
      { outputUrl: uploadedResults[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error during try-on:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
