import { getToken } from "../../utilities/token";
import { API_AUCTION_POSTS } from "../constants";

class PostError extends Error {
  constructor(
    message: string,
    public field?: string,
    public status?: number
  ) {
    super(message);
    this.name = "PostError";
  }
}

interface PostData {
  title: string;
  media: Array<{ url: string; alt?: string }>;
  description: string;
  endsAt: string;
}

export async function createPost(
  postData: PostData,
  onLoading?: (loading: boolean) => void
) {
  // Validation
  if (!postData.title.trim()) throw new PostError("Title is required", "title");
  if (postData.media.length === 0) throw new PostError("At least one media item is required", "media");
  if (!postData.endsAt) throw new PostError("End date is required", "endsAt");

  const token = getToken();
  if (!token) throw new PostError("Authentication required", undefined, 401);

  try {
    onLoading?.(true);
    const response = await fetch(API_AUCTION_POSTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new PostError(
        error.message || `Request failed with status ${response.status}`,
        undefined,
        response.status
      );
    }

    return await response.json();
  } finally {
    onLoading?.(false);
  }
}