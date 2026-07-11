import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  // 📦 Read and safely parse user data from localStorage
  const userData = localStorage.getItem("user");
  const rawUser = userData ? JSON.parse(userData) : null;

  // 🛠️ Adapt the data structure if fullName is present instead of firstName/lastName
  const user = rawUser
    ? {
        ...rawUser,
        firstName: rawUser.firstName || rawUser.fullName?.split(" ")[0] || "",
        lastName: rawUser.lastName || rawUser.fullName?.split(" ").slice(1).join(" ") || "",
      }
    : null;

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin"
        description="Profile Dashboard page for TailAdmin"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {/* Passing down the adapted user data as a prop */}
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          <UserAddressCard user={user} />
        </div>
      </div>
    </>
  );
}