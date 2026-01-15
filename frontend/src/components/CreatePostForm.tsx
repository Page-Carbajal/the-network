import React, { useState } from "react";
import { createPost } from "../api/posts";
import type { PostWithAuthor } from "../../../src/types/index.ts";

interface CreatePostFormProps {
  userId: number;
  onPostCreated?: (post: PostWithAuthor) => void;
}

function CreatePostForm({ userId, onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    if (content.length > 5000) {
      setError("Post content cannot exceed 5000 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const post = await createPost(userId, content);
      setContent("");
      onPostCreated?.(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {content.length}/5000 characters
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;
