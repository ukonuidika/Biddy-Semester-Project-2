import { z } from "zod";
import { API_AUTH_LOGIN } from "../constants";


const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
});

type LoginProps = z.infer<typeof loginSchema>;

export async function login(
  credentials: LoginProps,
  onLoading?: (isLoading: boolean) => void
): Promise<{ data: any }> {

  const validationResult = loginSchema.safeParse(credentials);
  
  if (!validationResult.success) {
   
    const errorMessage = validationResult.error.issues
      .map(issue => issue.message)
      .join("\n");
    throw new Error(errorMessage);
  }

  onLoading?.(true);

  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validationResult.data), // Use validated data
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  } finally {
    onLoading?.(false);
  }
}