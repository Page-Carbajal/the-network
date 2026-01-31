import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";
import type { PostWithAuthor } from "../../../src/types/index.ts";
import LikeButton from "./LikeButton";
import CommentList from "./CommentList";

function PostFeed() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [selectedUserId] = useState(1); // For demo purposes, using user ID 1

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

  const handleLikeChange = (postId: number, liked: boolean, newCount: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likesCount: newCount } : post
      )
    );
  };

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

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
              <div className="mt-4 flex items-center space-x-4">
                <LikeButton
                  postId={post.id}
                  userId={selectedUserId}
                  initialLikesCount={post.likesCount}
                  onLikeChange={(liked, newCount) => handleLikeChange(post.id, liked, newCount)}
                />
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.commentsCount}</span>
                </button>
              </div>
              {expandedComments.has(post.id) && <CommentList postId={post.id} />}
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
