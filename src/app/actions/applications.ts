"use server";

import { cookies } from "next/headers";
import { getPayload } from "@/lib/payload";
import { revalidatePath } from "next/cache";

export async function applyJobAction(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload();
    
    // Check Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;
    
    if (!token) {
      return { error: "You must be logged in to apply for a job." };
    }
    
    // Verify user by token
    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`
      })
    });
    
    if (!user) {
      return { error: "Unauthorized. Please log in." };
    }
    
    if (user.role === "employer") {
      return { error: "Employers cannot apply for jobs. Please log in as a Job Seeker." };
    }

    // Extract form data
    const jobId = formData.get("jobId") as string;
    const coverLetter = formData.get("coverLetter") as string;
    
    if (!jobId || !coverLetter) {
      return { error: "Job ID and Cover Letter are required." };
    }

    // Check if the user already applied to this job
    const existingApp = await payload.find({
      collection: "applications" as any,
      where: {
        and: [
          { job: { equals: jobId } },
          { applicant: { equals: user.id } }
        ]
      }
    });

    if (existingApp.totalDocs > 0) {
      return { error: "You have already applied for this job." };
    }

    // Create the application
    await payload.create({
      collection: "applications" as any,
      data: {
        job: jobId,
        applicant: user.id,
        status: "pending",
        coverLetter: coverLetter,
      } as any,
    });

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/profile");
    
    return { success: true };

  } catch (error: any) {
    console.error("Apply Job Error:", error);
    return { error: error.message || "Failed to submit application. Please try again." };
  }
}
