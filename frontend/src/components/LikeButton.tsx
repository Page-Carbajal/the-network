import React, { useState, useEffect } from "react";
import { toggleLike, fetchLikesCount } from "../api/likes";

interface LikeButtonProps {
  postId: number;
  userId: number;
  initialLikesCount: number;
  onLikeChange?: (liked: boolean, newCount: number) => void;
}

function LikeButton({ postId, userId, initialLikesCount, onLikeChange }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikesCount);
  }, [initialLikesCount]);

  const handleLike = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const result = await toggleLike(postId, userId);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
      onLikeChange?.(result.liked, result.likesCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        liked
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg
        className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likesCount}</span>
    </button>
  );
}

export default LikeButton;
