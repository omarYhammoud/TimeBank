import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router";

type Category = {
  _id: string;
  name: string;
};

type ServiceStatus =
  | "pending"
  | "active"
  | "inactive"
  | "rejected";

type LocationType =
  | "online"
  | "in_person"
  | "both";

type Service = {
  _id: string;
  categoryId: Category | null;
  title: string;
  description: string;
  locationType: LocationType;
  estimatedDurationHours: number;
  status: ServiceStatus;
};

type StoredUser = {
  _id?: string;
  id?: string;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const getCurrentUserId = (): string => {
  try {
    const value = localStorage.getItem("user");

    if (!value) {
      return "";
    }

    const user = JSON.parse(value) as StoredUser;

    return user._id || user.id || "";
  } catch {
    return "";
  }
};

const statusClasses: Record<
  ServiceStatus,
  string
> = {
  active:
    "bg-green-50 text-green-700 border-green-200",

  inactive:
    "bg-gray-50 text-gray-600 border-gray-200",

  pending:
    "bg-amber-50 text-amber-700 border-amber-200",

  rejected:
    "bg-red-50 text-red-700 border-red-200",
};

const MyServicesPage: React.FC = () => {
  const currentUserId = useMemo(
    () => getCurrentUserId(),
    []
  );

  const [services, setServices] = useState<
    Service[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState<
    string | null
  >(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const fetchMyServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!currentUserId) {
        throw new Error(
          "Please log in to view your services."
        );
      }

      const response = await fetch(
        `${API_URL}/services/my?userId=${encodeURIComponent(
          currentUserId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load your services."
        );
      }

      setServices(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your services."
      );
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]);

  const handleStatusToggle = async (
    service: Service
  ) => {
    try {
      setUpdatingId(service._id);
      setError("");
      setSuccess("");

      const newStatus =
        service.status === "active"
          ? "inactive"
          : "active";

      const response = await fetch(
        `${API_URL}/services/${service._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            providerId: currentUserId,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update service."
        );
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id ? data : item
        )
      );

      setSuccess(
        `Service changed to ${newStatus}.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update service."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (
    serviceId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(serviceId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/services/${serviceId}?userId=${encodeURIComponent(
          currentUserId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete service."
        );
      }

      setServices((previous) =>
        previous.filter(
          (service) =>
            service._id !== serviceId
        )
      );

      setSuccess("Service deleted successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete service."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              MY SERVICES
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage the services you offer.
            </p>
          </div>

          <Link
            to="/services/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Service
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500 dark:bg-gray-800">
            Loading your services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center dark:bg-gray-800">
            <p className="mb-4 text-sm text-gray-500">
              You have not created any services yet.
            </p>

            <Link
              to="/services/new"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Create Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold dark:bg-gray-700">
                    {service.categoryId?.name ||
                      "Uncategorized"}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                      statusClasses[service.status]
                    }`}
                  >
                    {service.status}
                  </span>
                </div>

                <h2 className="mb-2 font-bold">
                  {service.title}
                </h2>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>

                <div className="mb-4 space-y-1 text-xs text-gray-500">
                  <p>
                    Duration:{" "}
                    {
                      service.estimatedDurationHours
                    }{" "}
                    {service.estimatedDurationHours ===
                    1
                      ? "hour"
                      : "hours"}
                  </p>

                  <p>
                    Location:{" "}
                    {service.locationType.replace(
                      "_",
                      " "
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <Link
                    to={`/services/${service._id}/edit`}
                    className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-gray-600"
                  >
                    Edit
                  </Link>

                  {![
                    "pending",
                    "rejected",
                  ].includes(service.status) && (
                    <button
                      type="button"
                      disabled={
                        updatingId === service._id
                      }
                      onClick={() =>
                        handleStatusToggle(service)
                      }
                      className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600"
                    >
                      {service.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={
                      updatingId === service._id
                    }
                    onClick={() =>
                      handleDelete(service._id)
                    }
                    className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {updatingId === service._id
                      ? "Processing..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServicesPage;