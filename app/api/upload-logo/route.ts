import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const companyCode = formData.get("companyCode") as string;
    
    if (!file || !companyCode) {
      return NextResponse.json(
        { error: "File and company code are required" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${companyCode}-logo-${Date.now()}.${fileExt}`;
    
    // Create Supabase client
    const supabase = createClient();
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("company-logos") // Make sure this bucket exists in your Supabase project
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("company-logos")
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}