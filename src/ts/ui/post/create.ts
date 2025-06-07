import { createPost } from "../../api/post/create";

export async function onCreatePost(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formElements = {
    title: document.getElementById("title") as HTMLInputElement,
    endsAt: document.getElementById("endsAt") as HTMLInputElement,
    image: document.getElementById("image") as HTMLInputElement,
    content: document.getElementById("content") as HTMLTextAreaElement,
    loadingSpinner: document.getElementById("loadingSpinner") as HTMLElement,
    successMessage: document.getElementById("successMessage") as HTMLElement,
    errorMessage: document.getElementById("errorMessage") as HTMLElement,
    submitButton: form.querySelector("button[type='submit']") as HTMLButtonElement
  };

  // Validate form elements exist
  if (Object.values(formElements).some(el => !el)) {
    console.error("Missing required form elements");
    return;
  }

  const { 
    title, endsAt, image, content, 
    loadingSpinner, successMessage, errorMessage, submitButton 
  } = formElements;

  const setLoading = (isLoading: boolean) => {
    loadingSpinner.style.display = isLoading ? "block" : "none";
    submitButton.disabled = isLoading;
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
  };

  const clearForm = () => {
    form.reset();
    successMessage.style.display = "block";
    successMessage.innerText = "Post created successfully!";
    setTimeout(() => successMessage.style.display = "none", 3000);
  };

  try {
    setLoading(true);

    const postData = {
      title: title.value.trim(),
      media: [{
        url: image.value.trim(),
        alt: `Image for ${title.value.trim()}`
      }],
      description: content.value.trim(),
      endsAt: new Date(endsAt.value).toISOString()
    };

    await createPost(postData, setLoading);
    clearForm();
    console.log("Post created successfully");

  } catch (error) {
    console.error("Post creation failed:", error);
    
    errorMessage.innerText = error instanceof Error 
      ? error.message 
      : "Failed to create post. Please try again.";
    errorMessage.style.display = "block";

  } finally {
    setLoading(false);
  }
}