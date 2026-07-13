import { useState } from "react";

import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

interface UserProfile {
  bio?: string;
  skills?: string[];
  location?: string;
  phone?: string;
  profileImage?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
  ratingAverage?: number;
  completedServices?: number;
}

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
  profile?: UserProfile;
  wallet?: {
    balanceHours?: number;
    totalEarned?: number;
    totalSpent?: number;
  };
}

const readStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    const parsedUser: User = JSON.parse(storedUser);

    return {
      ...parsedUser,
      firstName:
        parsedUser.firstName ||
        parsedUser.fullName?.trim().split(" ")[0] ||
        "",
      lastName:
        parsedUser.lastName ||
        parsedUser.fullName
          ?.trim()
          .split(" ")
          .slice(1)
          .join(" ") ||
        "",
    };
  } catch (error) {
    console.error("Could not parse stored user:", error);
    return null;
  }
};

export default function UserProfiles() {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const handleUserUpdated = (updatedUser: User) => {
    const adaptedUser: User = {
      ...updatedUser,

      firstName:
        updatedUser.fullName?.trim().split(" ")[0] || "",

      lastName:
        updatedUser.fullName
          ?.trim()
          .split(" ")
          .slice(1)
          .join(" ") || "",
    };

    setUser(adaptedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <>
      <PageMeta
        title="TimeBank Profile"
        description="Manage your TimeBank profile"
      />

      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>

        <div className="space-y-6">
          <UserMetaCard user={user} />

          <UserInfoCard
            user={user}
            onUserUpdated={handleUserUpdated}
          />

          <UserAddressCard
            user={user}
            onUserUpdated={handleUserUpdated}
          />
        </div>
      </div>
    </>
  );
}