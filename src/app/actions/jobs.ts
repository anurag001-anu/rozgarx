"use server";

import { cookies } from "next/headers";
import { getPayload } from "@/lib/payload";
import { revalidatePath } from "next/cache";

export async function postJobAction(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload();
    
    // Check Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;
    
    if (!token) {
      return { error: "You must be logged in to post a job." };
    }
    
    // Verify user by token
    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`
      })
    });
    
    if (!user || user.role !== "employer") {
      return { error: "Unauthorized. Only employers can post jobs." };
    }

    // Extract form data
    const title = formData.get("title") as string;
    const jobType = formData.get("jobType") as "Full Time" | "Part Time" | "Contract" | "Internship";
    const workMode = formData.get("workMode") as "On-site" | "Hybrid" | "Remote";
    const location = formData.get("location") as string;
    const experience = formData.get("experience") as string;
    const salary = formData.get("salary") as string;
    const description = formData.get("description") as string;

    if (!title || !jobType || !location || !description) {
      return { error: "Please fill in all required fields." };
    }

    // Create the job in Payload
    const newJob = await payload.create({
      collection: "jobs",
      data: {
        title,
        type: "private", // Assuming employers only post private jobs
        jobType,
        workMode,
        location,
        experience,
        salary,
        owner: user.id,
        // Convert plain text description to simple Lexical format
        description: {
          root: {
            type: "root",
            format: "" as const,
            indent: 0,
            version: 1,
            direction: "ltr" as const,
            children: [
              {
                type: "paragraph",
                format: "" as const,
                indent: 0,
                version: 1,
                direction: "ltr" as const,
                children: [
                  {
                    mode: "normal",
                    text: description,
                    type: "text",
                    detail: 0,
                    format: 0,
                    style: "",
                  },
                ],
              },
            ],
          },
        },
      },
    });

    revalidatePath("/jobs");
    revalidatePath("/employer");
    
    return { success: true, jobId: newJob.id };

  } catch (error: any) {
    console.error("Job Post Error:", error);
    return { error: error.message || "Failed to post job. Please try again." };
  }
}
