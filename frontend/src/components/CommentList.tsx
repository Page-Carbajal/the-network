import React, { useEffect, useState } from "react";
import { fetchCommentsByPostId } from "../api/comments";
import type { CommentWithAuthor } from "../../../src/types/index.ts";

interface CommentListProps {
  postId: number;
}

function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        const data = await fetchCommentsByPostId(postId);
        setComments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load comments");
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [postId]);

  if (loading) {
    return <div className="text-sm text-gray-500 py-2">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600 py-2">Error loading comments</div>;
  }

  if (comments.length === 0) {
    return <div className="text-sm text-gray-500 py-2">No comments yet</div>;
  }

  return (
    <div className="space-y-3 mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3">
          {comment.author.avatar && (
            <img
              src={comment.author.avatar}
              alt={`${comment.author.firstName} ${comment.author.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900">
                {comment.author.firstName} {comment.author.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
