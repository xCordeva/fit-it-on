import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import busboy from "busboy";
import { Readable } from "stream";
import { supabase } from "@/lib/supabaseClient";

const uploadBufferToSupabase = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from("user-uploads")
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

const uploadImageFromUrlToSupabase = async (
  imageUrl: string,
  fileType: string,
  userId: string
): Promise<string> => {
  const response: Response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
  }

  const blob: Blob = await response.blob();
  const filePath: string = `users/${userId}/${fileType}/result-${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, blob, {
      contentType: blob.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function POST(req: NextRequest) {
  const formData = await new Promise<{
    userId: string;
    garmentImageUrl: string;
    personImage: { filename: string; buffer: Buffer; mimetype: string };
  }>((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    let personImageBuffer: Buffer;
    let personImageFilename: string;
    let personImageMimeType: string;
    let garmentImageUrl: string;
    let userId: string;

    bb.on("file", (name: string, file: Readable, info: busboy.FileInfo) => {
      const { filename, mimeType } = info;
      if (name === "personImage") {
        personImageFilename = filename;
        personImageMimeType = mimeType;
        const chunks: Buffer[] = [];
        file.on("data", (chunk: Buffer) => chunks.push(chunk));
        file.on("end", () => {
          personImageBuffer = Buffer.concat(chunks);
        });
      }
    });

    bb.on("field", (name: string, value: string) => {
      if (name === "garmentImageUrl") {
        garmentImageUrl = value;
      }
      if (name === "userId") {
        userId = value;
      }
    });

    bb.on("close", () => {
      if (!personImageBuffer || !garmentImageUrl) {
        reject(new Error("Missing form fields"));
      }
      resolve({
        userId,
        garmentImageUrl,
        personImage: {
          filename: personImageFilename,
          buffer: personImageBuffer,
          mimetype: personImageMimeType,
        },
      });
    });

    bb.on("error", (err: Error) => reject(err));

    (req as unknown as Readable).pipe(bb);
  });

  const { personImage, garmentImageUrl, userId } = formData;
  const userIdentifier: string = userId || `anon/${uuidv4()}`;

  try {
    // --- 1. UPLOAD IMAGES TO SUPABASE ---
    const modelImageUrl: string = await uploadBufferToSupabase(
      personImage.buffer,
      `users/${userIdentifier}/person/${uuidv4()}-${personImage.filename}`,
      personImage.mimetype
    );

    // --- 2. SEND PREDICTION REQUEST TO FASHN API ---
    const runResponse: Response = await fetch(
      `${process.env.FASHN_BASE_URL}/run`,
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
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!runResponse.ok) {
      const errorText: string = await runResponse.text();
      console.error("FASHN API start error:", errorText);
      throw new Error("Failed to start try-on process with FASHN API");
    }

    const { id: predictionId }: { id: string } = await runResponse.json();

    // --- 3. POLL FASHN API FOR RESULT ---
    let status: string = "starting";
    let output: string[] = [];
    const pollingStartTime: number = Date.now();
    const pollingTimeout: number = 60000;

    while (status !== "completed" && status !== "failed") {
      if (Date.now() - pollingStartTime > pollingTimeout) {
        throw new Error("FASHN API polling timed out");
      }
      const statusResponse: Response = await fetch(
        `${process.env.FASHN_BASE_URL}/status/${predictionId}`,
        {
          headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` },
        }
      );
      if (!statusResponse.ok) throw new Error("Failed to fetch try-on status");
      const statusData: {
        status: string;
        output?: string[];
        error?: { message: string };
      } = await statusResponse.json();
      status = statusData.status;
      if (status === "completed") {
        output = statusData.output as string[];
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
        uploadImageFromUrlToSupabase(url, "results", userIdentifier)
      )
    );

    // --- 5. DECREMENT TRIAL COUNT ---
    // If the user is authenticated (not anonymous), call the decrement API.
    if (!userIdentifier.startsWith("anon/")) {
      await fetch(`https://www.fititon.app/api/decrement-trial`, {
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
      {
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
