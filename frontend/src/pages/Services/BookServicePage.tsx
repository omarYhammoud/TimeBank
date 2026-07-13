import React, {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

type UserReference = {
  _id: string;
  fullName?: string;
  email?: string;
};

type CategoryReference = {
  _id: string;
  name?: string;
};

type Service = {
  _id: string;
  providerId: UserReference | null;
  categoryId: CategoryReference | null;
  title: string;
  description: string;
  locationType: "online" | "in_person" | "both";
  estimatedDurationHours: number;
  status: "pending" | "active" | "inactive" | "rejected";
};

type StoredUser = {
  _id?: string;
  id?: string;
  fullName?: string;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const getStoredUser = (): StoredUser | null => {
  try {
    const value = localStorage.getItem("user");

    if (!value) {
      return null;
    }

    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
};

const toLocalInputValue = (date: Date): string => {
  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
};

const BookServicePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = useMemo(
    () => getStoredUser(),
    []
  );

  const currentUserId =
    storedUser?._id || storedUser?.id || "";

  const defaultStart = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0, 0, 0);

    return toLocalInputValue(date);
  }, []);

  const [service, setService] =
    useState<Service | null>(null);

  const [scheduledStart, setScheduledStart] =
    useState(defaultStart);

  const [durationHours, setDurationHours] =
    useState("1");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error(
            "Service ID is missing."
          );
        }

        const response = await fetch(
          `${API_URL}/services/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load service."
          );
        }

        setService(data);

        setDurationHours(
          String(
            data.estimatedDurationHours || 1
          )
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (!service) {
        throw new Error(
          "Service information is missing."
        );
      }

      if (!currentUserId) {
        throw new Error(
          "Please sign in before requesting a booking."
        );
      }

      if (
        service.providerId?._id ===
        currentUserId
      ) {
        throw new Error(
          "You cannot book your own service."
        );
      }

      const duration = Number(durationHours);

      if (
        !Number.isFinite(duration) ||
        duration < 1
      ) {
        throw new Error(
          "Duration must be at least one hour."
        );
      }

      const startDate =
        new Date(scheduledStart);

      if (
        Number.isNaN(startDate.getTime())
      ) {
        throw new Error(
          "Please select a valid start time."
        );
      }

      const endDate = new Date(
        startDate.getTime() +
          duration * 60 * 60 * 1000
      );

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            serviceId: service._id,
            requesterId: currentUserId,
            scheduledStart:
              startDate.toISOString(),
            scheduledEnd:
              endDate.toISOString(),
            durationHours: duration,

            /*
             * In TimeBank, one hour usually
             * equals one time credit.
             */
            creditsAmount: duration,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create booking."
        );
      }

      navigate("/bookings");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to request booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        Loading service...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center dark:bg-gray-900">
        <p className="mb-4 text-red-600">
          {error || "Service not found."}
        </p>

        <Link
          to="/browse"
          className="text-indigo-600 hover:underline"
        >
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            REQUEST BOOKING
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a date and duration for this
            service.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <p className="mb-1 text-xs font-semibold uppercase text-indigo-600">
            {service.categoryId?.name ||
              "Service"}
          </p>

          <h2 className="text-lg font-bold">
            {service.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Offered by{" "}
            {service.providerId?.fullName ||
              "Unknown provider"}
          </p>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {service.description}
          </p>

          <p className="mt-3 text-xs text-gray-500">
            Suggested duration:{" "}
            {
              service.estimatedDurationHours
            }{" "}
            {service.estimatedDurationHours ===
            1
              ? "hour"
              : "hours"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Start Date and Time
            </label>

            <input
              type="datetime-local"
              required
              value={scheduledStart}
              min={toLocalInputValue(
                new Date()
              )}
              onChange={(event) =>
                setScheduledStart(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Duration in Hours
            </label>

            <input
              type="number"
              required
              min="1"
              step="1"
              value={durationHours}
              onChange={(event) =>
                setDurationHours(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div className="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
            Cost: {durationHours || "0"}{" "}
            {Number(durationHours) === 1
              ? "time credit"
              : "time credits"}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
            <Link
              to="/browse"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-600"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Sending Request..."
                : "Request Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookServicePage;