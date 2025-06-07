import { login } from "../../api/auth/login";

export async function onLogin(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const loginForm = event.target as HTMLFormElement;
  const email = (loginForm.querySelector("#email") as HTMLInputElement).value;
  const password = (loginForm.querySelector("#password") as HTMLInputElement).value;
  
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = loginForm.querySelector("button[type='submit']") as HTMLButtonElement;

  // Ensure all required elements exist
  if (!loadingSpinner || !errorMessage || !submitButton) {
    console.error("Required elements are missing");
    return;
  }

  // Reset UI state
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
  loadingSpinner.style.display = "block";
  submitButton.disabled = true;

  try {
    const result = await login(
      { email, password },
      (isLoading) => {
        loadingSpinner.style.display = isLoading ? "block" : "none";
        submitButton.disabled = isLoading;
      }
    );

    console.log("Login successful:", result);
    localStorage.setItem("username", result.data.name);
    localStorage.setItem("token", result.data.accessToken);
    window.location.replace("/");
    
  } catch (error: unknown) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    } else {
      errorMessage.textContent = "An unknown error occurred";
      errorMessage.style.display = "block";
    }
  } finally {
    loadingSpinner.style.display = "none";
    submitButton.disabled = false;
  }
}

// Password visibility toggle logic (unchanged)
export function initializePasswordToggle() {
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const togglePasswordButton = document.getElementById("toggle-password") as HTMLElement | null;

  if (!passwordInput || !togglePasswordButton) {
    throw new Error("Required elements not found in the DOM");
  }

  const toggleIcon = togglePasswordButton.querySelector("i")!;
  let isPasswordVisible = false;

  togglePasswordButton.addEventListener("click", function () {
    isPasswordVisible = !isPasswordVisible;

    if (isPasswordVisible) {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
      togglePasswordButton.setAttribute("aria-label", "Hide Password");
    } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
      togglePasswordButton.setAttribute("aria-label", "Show Password");
    }
  });
}