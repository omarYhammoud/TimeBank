import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";

interface UserProfile {
  bio?: string;
  phone?: string;
  location?: string;
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

interface UserInfoCardProps {
  user: User | null;
  onUserUpdated?: (updatedUser: User) => void;
}

interface PersonalFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

const API_URL = "http://localhost:3000/api";

export default function UserInfoCard({
  user,
  onUserUpdated,
}: UserInfoCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] =
    useState<PersonalFormData>({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
    });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      location: user?.profile?.location || "",
      bio: user?.profile?.bio || "",
    });
  }, [user]);

  const handleOpenModal = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      location: user?.profile?.location || "",
      bio: user?.profile?.bio || "",
    });

    setError("");
    openModal();
  };

  const handleCloseModal = () => {
    if (isSaving) {
      return;
    }

    setError("");
    closeModal();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token was not found. Please log in again."
        );
      }

      if (formData.fullName.trim().length < 2) {
        throw new Error(
          "Full name must contain at least 2 characters."
        );
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          bio: formData.bio.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update profile."
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      onUserUpdated?.(data.user);

      closeModal();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.fullName || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Email
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.email || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Phone
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.profile?.phone || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Location
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.profile?.location || "—"}
                </p>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Bio
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.profile?.bio || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="m-4 max-w-[700px]"
      >
        <div className="relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your profile details.
          </p>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <Label>Full Name</Label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <Label>Email</Label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <Label>Phone</Label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <Label>Location</Label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Bio</Label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3 lg:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-brand-500 px-4 py-3 text-sm text-white disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}