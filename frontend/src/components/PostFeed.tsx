import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";
import type { PostWithAuthor } from "../../../src/types/index.ts";

function PostFeed() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start space-x-4">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </p>
                <p className="text-sm text-gray-500">@{post.author.username}</p>
                <span className="text-sm text-gray-400">·</span>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-gray-900 whitespace-pre-wrap">{post.content}</p>
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <span>{post.likesCount} likes</span>
                <span>{post.commentsCount} comments</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
}

export default PostFeed;
