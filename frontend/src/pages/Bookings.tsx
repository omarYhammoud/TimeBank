import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router";

type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed"


type BookingType = "Offering" | "Requested";

type BookingTab =
  | "upcoming"
  | "pending"
  | "completed"
  | "cancelled"
  | "rejected"


type UserReference = {
  _id: string;
  fullName?: string;
  email?: string;
};

type ServiceReference = {
  _id: string;
  title?: string;
  name?: string;
  serviceName?: string;
};

type Booking = {
  _id: string;
  serviceId: ServiceReference | null;
  requesterId: UserReference | null;
  providerId: UserReference | null;
  scheduledStart: string;
  scheduledEnd: string;
  durationHours: number;
  creditsAmount: number;
  status: BookingStatus;
  creditsTransferred: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type StoredUser = {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getStoredUser = (): StoredUser | null => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return null;
  }
};

const getServiceName = (booking: Booking): string => {
  return (
    booking.serviceId?.title ||
    booking.serviceId?.name ||
    booking.serviceId?.serviceName ||
    "Unknown service"
  );
};

const getUserName = (
  user: UserReference | null
): string => {
  if (!user) {
    return "Unknown member";
  }

  return user.fullName || user.email || "Unknown member";
};

const formatDateTime = (dateValue: string): string => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-LB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const statusStyles: Record<BookingStatus, string> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",

  accepted:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900",

  completed:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900",

  rejected:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900",

  cancelled:
    "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",


};

const BookingsPage: React.FC = () => {
  const storedUser = useMemo(() => getStoredUser(), []);

  const currentUserId =
    storedUser?._id || storedUser?.id || "";

  const [activeTab, setActiveTab] =
    useState<BookingTab>("upcoming");

  const [bookingType, setBookingType] =
    useState<BookingType>("Offering");

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [successMessage, setSuccessMessage] =
    useState<string>("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!currentUserId) {
        throw new Error(
          "Logged-in user information was not found. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/bookings?userId=${encodeURIComponent(
          currentUserId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load bookings."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "The server returned an invalid bookings response."
        );
      }

      setBookings(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load bookings.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    try {
      setUpdatingId(bookingId);
      setError("");
      setSuccessMessage("");

      if (!currentUserId) {
        throw new Error(
          "Logged-in user information was not found."
        );
      }

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
            changedBy: currentUserId,
            note: `Booking status changed to ${newStatus}.`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update the booking status."
        );
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? data
            : booking
        )
      );

      setSuccessMessage(
        `Booking status changed to ${newStatus}.`
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update booking.";

      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const providerId =
        booking.providerId?._id || "";

      const requesterId =
        booking.requesterId?._id || "";

      if (
        bookingType === "Offering" &&
        providerId !== currentUserId
      ) {
        return false;
      }

      if (
        bookingType === "Requested" &&
        requesterId !== currentUserId
      ) {
        return false;
      }

      if (activeTab === "upcoming") {
        return ["pending", "accepted"].includes(
          booking.status
        );
      }

      return booking.status === activeTab;
    });
  }, [
    bookings,
    bookingType,
    activeTab,
    currentUserId,
  ]);

  const getOtherMember = (
    booking: Booking
  ): UserReference | null => {
    if (bookingType === "Offering") {
      return booking.requesterId;
    }

    return booking.providerId;
  };

  const renderActions = (booking: Booking) => {
    const isUpdating =
      updatingId === booking._id;

    if (
      booking.status === "pending" &&
      bookingType === "Offering"
    ) {
      return (
        <>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              handleStatusChange(
                booking._id,
                "accepted"
              )
            }
            className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {isUpdating ? "Updating..." : "Accept"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              handleStatusChange(
                booking._id,
                "rejected"
              )
            }
            className="rounded border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:bg-gray-700 dark:hover:bg-red-950/20"
          >
            Reject
          </button>
        </>
      );
    }

    if (
      booking.status === "pending" &&
      bookingType === "Requested"
    ) {
      return (
        <button
          type="button"
          disabled={isUpdating}
          onClick={() =>
            handleStatusChange(
              booking._id,
              "cancelled"
            )
          }
          className="rounded border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:bg-gray-700 dark:hover:bg-red-950/20"
        >
          {isUpdating ? "Updating..." : "Cancel"}
        </button>
      );
    }

    if (
      booking.status === "accepted" &&
      bookingType === "Offering"
    ) {
      return (
        <button
          type="button"
          disabled={isUpdating}
          onClick={() =>
            handleStatusChange(
              booking._id,
              "completed"
            )
          }
          className="rounded bg-gray-950 px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          {isUpdating
            ? "Updating..."
            : "Complete"}
        </button>
      );
    }

    if (
      booking.status === "accepted" &&
      bookingType === "Requested"
    ) {
      return (
        <button
          type="button"
          disabled={isUpdating}
          onClick={() =>
            handleStatusChange(
              booking._id,
              "cancelled"
            )
          }
          className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isUpdating ? "Updating..." : "Cancel"}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            My Bookings
          </h1>

          <div className="flex self-start rounded-xl border border-gray-300 bg-gray-200 p-1 dark:border-gray-700 dark:bg-gray-800 sm:self-auto">
            <button
              type="button"
              onClick={() =>
                setBookingType("Offering")
              }
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                bookingType === "Offering"
                  ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              💼 Offering
            </button>

            <button
              type="button"
              onClick={() =>
                setBookingType("Requested")
              }
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                bookingType === "Requested"
                  ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              🤝 Requested
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-3 dark:border-gray-800">
          {(
            [
              "upcoming",
              "pending",
              "completed",
              "cancelled",
              "rejected",

            ] as BookingTab[]
          ).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
            <span>{successMessage}</span>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage("")
              }
              className="font-bold"
              aria-label="Close success message"
            >
              ×
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-400">
                  <th className="p-4">Service</th>
                  <th className="p-4">Member</th>
                  <th className="p-4">
                    Date / Time
                  </th>
                  <th className="p-4">
                    Duration
                  </th>
                  <th className="p-4">
                    Credits
                  </th>
                  <th className="p-4 text-center">
                    Status
                  </th>
                  <th className="p-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No{" "}
                      {bookingType.toLowerCase()}{" "}
                      bookings match this status.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(
                    (booking) => {
                      const member =
                        getOtherMember(booking);

                      return (
                        <tr
                          key={booking._id}
                          className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-700/20"
                        >
                          <td className="p-4 text-sm font-medium">
                            {getServiceName(
                              booking
                            )}
                          </td>

                          <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="font-medium">
                              {getUserName(member)}
                            </div>

                            {member?.email && (
                              <div className="mt-1 text-xs text-gray-400">
                                {member.email}
                              </div>
                            )}
                          </td>

                          <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                            <div>
                              {formatDateTime(
                                booking.scheduledStart
                              )}
                            </div>

                            <div className="mt-1 text-xs">
                              Until{" "}
                              {formatDateTime(
                                booking.scheduledEnd
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                            {booking.durationHours}{" "}
                            {booking.durationHours ===
                            1
                              ? "hour"
                              : "hours"}
                          </td>

                          <td className="p-4 text-sm font-medium">
                            {booking.creditsAmount}
                          </td>

                          <td className="p-4 text-center">
                            <span
                              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                                statusStyles[
                                  booking.status
                                ]
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              {renderActions(
                                booking
                              )}

                              {booking.status ===
                                "completed" && (
                                <Link
                                  to={`/reviews?bookingId=${booking._id}`}
                                  className="rounded border border-gray-300 bg-white px-3 py-1 text-center text-xs font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                  Leave Review
                                </Link>
                              )}

                              {![
                                "cancelled",
                                "rejected",

                              ].includes(
                                booking.status
                              ) && (
                                <Link
                                  to={`/report?bookingId=${booking._id}`}
                                  className="rounded border border-red-200 bg-white px-3 py-1 text-center text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:bg-gray-700 dark:hover:bg-red-950/20"
                                >
                                  Report
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={fetchBookings}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Refresh Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;