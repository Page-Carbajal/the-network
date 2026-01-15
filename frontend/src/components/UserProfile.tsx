import React, { useEffect, useState } from "react";
import { fetchUserById } from "../api/users";
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from "../api/followers";
import { getPostsByUserId } from "../api/posts";
import { fetchUserById } from "../api/users";
import type { User, PostWithAuthor } from "../../../src/types/index.ts";

interface UserProfileProps {
  userId: number;
  currentUserId: number;
}

function UserProfile({ userId, currentUserId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const [userData, followersData, followingData, postsData] = await Promise.all([
          fetchUserById(userId),
          fetchFollowers(userId),
          fetchFollowing(userId),
          getPostsByUserId(userId),
        ]);

        setUser(userData);
        setFollowers(followersData.followers);
        setFollowing(followingData.following);
        setPosts(postsData);
        setIsFollowing(followingData.following.some((u) => u.id === currentUserId));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId, currentUserId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, userId);
        setIsFollowing(false);
        setFollowers((prev) => prev.filter((u) => u.id !== currentUserId));
      } else {
        await followUser(currentUserId, userId);
        setIsFollowing(true);
        const currentUser = await fetchUserById(currentUserId);
        setFollowers((prev) => [...prev, currentUser]);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-start space-x-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">@{user.username}</p>
          {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          <div className="mt-4 flex items-center space-x-6">
            <div>
              <span className="font-semibold">{posts.length}</span>
              <span className="text-gray-500 ml-1">posts</span>
            </div>
            <div>
              <span className="font-semibold">{followers.length}</span>
              <span className="text-gray-500 ml-1">followers</span>
            </div>
            <div>
              <span className="font-semibold">{following.length}</span>
              <span className="text-gray-500 ml-1">following</span>
            </div>
          </div>
          {userId !== currentUserId && (
            <button
              onClick={handleFollowToggle}
              className={`mt-4 px-4 py-2 rounded-lg font-medium ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
