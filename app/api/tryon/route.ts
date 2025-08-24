import { NextResponse } from "next/server";
import {
  sanitizeFilename,
  uploadBufferToSupabase,
  uploadImageFromUrlToSupabase,
} from "@/lib/tryOnHelpers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: any) {
  try {
    let personImageFile: File | null = null;
    let garmentImageUrl: string | null = null;
    let userId: string | null = null;
    let isExtensionRequest = false;

    // Check if this is a JSON request (likely from extension) or form data
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Handle JSON requests (from extension)
      const jsonData = await req.json();
      isExtensionRequest = true;

      // Extract data from JSON payload
      if (jsonData.personImage) {
        // Check if personImage is a URL or base64 string
        if (jsonData.personImage.startsWith("http")) {
          // It's a URL, we can use it directly
          garmentImageUrl = jsonData.garmentImageUrl || jsonData.garmentImage;
          userId = jsonData.userId || jsonData.user_id;

          // For URL-based requests, we need to handle them differently
          // We'll download the image and then process it
          const imageResponse = await fetch(jsonData.personImage);
          if (!imageResponse.ok) {
            throw new Error("Failed to fetch person image from URL");
          }
          const imageBuffer = await imageResponse.arrayBuffer();
          personImageFile = new File([imageBuffer], "person-image.jpg", {
            type: imageResponse.headers.get("content-type") || "image/jpeg",
          });
        } else if (jsonData.personImage.startsWith("data:")) {
          // It's a base64 string, convert it to a File object
          const base64Data = jsonData.personImage.split(",")[1];
          const mimeType = jsonData.personImage.split(":")[1].split(";")[0];
          const buffer = Buffer.from(base64Data, "base64");
          personImageFile = new File([buffer], "person-image.jpg", {
            type: mimeType,
          });
        } else if (jsonData.personImage instanceof File) {
          personImageFile = jsonData.personImage;
        }
      }

      garmentImageUrl = jsonData.garmentImageUrl || jsonData.garmentImage;
      userId = jsonData.userId || jsonData.user_id;
    } else {
      // Handle form data requests (from web app)
      const formData = await req.formData();
      personImageFile = formData.get("personImage") as File;
      garmentImageUrl = formData.get("garmentImageUrl") as string;
      userId = formData.get("userId") as string;
    }

    // Ensure all required fields are present
    if (!personImageFile || !garmentImageUrl) {
      return NextResponse.json(
        {
          error: "Missing personImage or garmentImageUrl",
          received: {
            hasPersonImage: !!personImageFile,
            hasGarmentImage: !!garmentImageUrl,
            isExtensionRequest,
          },
        },
        { status: 400 }
      );
    }

    // Convert the File object to a Buffer
    const personImageBuffer = Buffer.from(await personImageFile.arrayBuffer());

    // Construct path for person image
    const sanitizedFilename = sanitizeFilename(
      personImageFile.name || "person-image.jpg"
    );
    const personImageFilePath = `users/${userId}/person/${Date.now()}-${sanitizedFilename}`;

    const modelImageUrl = await uploadBufferToSupabase(
      personImageBuffer,
      personImageFilePath,
      personImageFile.type
    );

    // --- 2. SEND PREDICTION REQUEST TO FASHN API ---
    let runResponse: any;

    // Real FASHN API call
    if (
      !process.env.NEXT_PUBLIC_FASHN_BASE_URL ||
      !process.env.NEXT_PUBLIC_FASHN_API_KEY
    ) {
      throw new Error("FASHN API configuration missing");
    }

    runResponse = await fetch(`${process.env.NEXT_PUBLIC_FASHN_BASE_URL}/run`, {
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
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      throw new Error("Failed to start try-on process with FASHN API");
    }

    const { id: predictionId } = await runResponse.json();

    // --- 3. POLL FASHN API FOR RESULT ---
    let status = "starting";
    let output: string[] = [];

    // Real API polling
    const pollingStartTime = Date.now();
    const pollingTimeout = 60000; // 60s timeout

    while (status !== "completed" && status !== "failed") {
      if (Date.now() - pollingStartTime > pollingTimeout) {
        throw new Error("FASHN API polling timed out");
      }

      const statusResponse = await fetch(
        `${process.env.NEXT_PUBLIC_FASHN_BASE_URL}/status/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FASHN_API_KEY}`,
          },
        }
      );

      if (!statusResponse.ok) {
        throw new Error("Failed to fetch try-on status");
      }

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
    let uploadedResults: string[];
    try {
      if (!userId) {
        throw new Error("User ID is required for uploading results");
      }

      uploadedResults = await Promise.all(
        output.map((url: string) =>
          uploadImageFromUrlToSupabase(url, "results", userId!)
        )
      );
    } catch (uploadErr) {
      throw uploadErr;
    }

    // --- 5. DECREMENT TRIAL COUNT ---
    if (userId && !userId.startsWith("anon/")) {
      try {
        const supabase = createRouteHandlerClient({ cookies });
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: currentData } = await supabase
            .from("users")
            .select("trial_count")
            .eq("id", user.id)
            .single();

          if (currentData) {
            await supabase
              .from("users")
              .update({ trial_count: Math.max(currentData.trial_count - 1, 0) })
              .eq("id", user.id);
          }
        }
      } catch (trialError) {
        // Don't fail the entire request if trial decrement fails
      }
    }

    // --- 6. RETURN FINAL RESULT ---
    const responseData = {
      success: true,
      outputUrl: uploadedResults[0],
      outputUrls: uploadedResults,
      predictionId,
      isExtensionRequest,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    });
  } catch (err) {
    const errorResponse = {
      success: false,
      error: err instanceof Error ? err.message : "Server error",
      details: process.env.NODE_ENV === "development" ? err : undefined,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    });
  }
}

// Handle OPTIONS request for CORS (important for extension requests)
export async function OPTIONS(req: any) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    },
  });
}
