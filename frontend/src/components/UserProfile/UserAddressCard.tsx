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
  country?: string;
  cityState?: string;
  postalCode?: string;
}

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
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

interface UserAddressCardProps {
  user: User | null;
  onUserUpdated?: (updatedUser: User) => void;
}

interface AddressFormData {
  country: string;
  cityState: string;
  postalCode: string;
}

const API_URL = "http://localhost:3000/api";

export default function UserAddressCard({
  user,
  onUserUpdated,
}: UserAddressCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] =
    useState<AddressFormData>({
      country: "",
      cityState: "",
      postalCode: "",
    });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      country: user?.profile?.country || "",
      cityState: user?.profile?.cityState || "",
      postalCode: user?.profile?.postalCode || "",
    });
  }, [user]);

  const handleOpenModal = () => {
    setFormData({
      country: user?.profile?.country || "",
      cityState: user?.profile?.cityState || "",
      postalCode: user?.profile?.postalCode || "",
    });

    setError("");
    openModal();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
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

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          country: formData.country.trim(),
          cityState: formData.cityState.trim(),
          postalCode: formData.postalCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update address."
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
          : "Could not update address."
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
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7">
              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Country
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.profile?.country || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  City/State
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.profile?.cityState || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Postal Code
                </p>

                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.profile?.postalCode || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="m-4 max-w-[700px]"
      >
        <div className="relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Address
          </h4>

          <p className="mb-6 text-sm text-gray-500">
            Update your address information.
          </p>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <Label>Country</Label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <Label>City/State</Label>

                <input
                  type="text"
                  name="cityState"
                  value={formData.cityState}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Postal Code</Label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
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
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm"
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