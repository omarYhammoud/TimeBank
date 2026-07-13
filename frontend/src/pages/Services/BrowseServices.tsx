import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router";

type Provider = {
  _id: string;
  fullName?: string;
  email?: string;

  profile?: {
    ratingAverage?: number;
  };
};

type Category = {
  _id: string;
  name: string;
  description?: string;
  status?: "active" | "inactive";
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

type ServiceListing = {
  _id: string;
  providerId: Provider | null;
  categoryId: Category | null;
  title: string;
  description: string;
  locationType: LocationType;
  estimatedDurationHours: number;
  status: ServiceStatus;
  createdAt?: string;
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
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "";
    }

    const user = JSON.parse(storedUser) as StoredUser;

    return user._id || user.id || "";
  } catch {
    return "";
  }
};

const formatLocationType = (
  locationType: LocationType
): string => {
  if (locationType === "online") {
    return "Online";
  }

  if (locationType === "in_person") {
    return "In person";
  }

  return "Online or in person";
};

const BrowseServicesPage: React.FC = () => {
  const currentUserId = useMemo(
    () => getCurrentUserId(),
    []
  );

  const [services, setServices] = useState<
    ServiceListing[]
  >([]);

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError("");

        const servicesUrl = currentUserId
          ? `${API_URL}/services?status=active&excludeProviderId=${encodeURIComponent(
              currentUserId
            )}`
          : `${API_URL}/services?status=active`;

        const [servicesResponse, categoriesResponse] =
          await Promise.all([
            fetch(servicesUrl),
            fetch(`${API_URL}/categories`),
          ]);

        const servicesData =
          await servicesResponse.json();

        const categoriesData =
          await categoriesResponse.json();

        if (!servicesResponse.ok) {
          throw new Error(
            servicesData.message ||
              "Failed to load services."
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData.message ||
              "Failed to load categories."
          );
        }

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : []
        );

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData.filter(
                (category: Category) =>
                  category.status !== "inactive"
              )
            : []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load services."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [currentUserId]);

  const filteredServices = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        service.title
          .toLowerCase()
          .includes(query) ||
        service.description
          .toLowerCase()
          .includes(query) ||
        service.categoryId?.name
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        service.categoryId?._id ===
          selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    services,
    searchQuery,
    selectedCategory,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              BROWSE SERVICES
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Discover services offered by other
              TimeBank members.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 md:w-80"
            />

            <Link
              to="/services/new"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add Service
            </Link>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
          <button
            type="button"
            onClick={() =>
              setSelectedCategory("all")
            }
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
              selectedCategory === "all"
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() =>
                setSelectedCategory(category._id)
              }
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                selectedCategory === category._id
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
            Loading services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-400">
              No active services match your
              current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {service.categoryId?.name ||
                        "Uncategorized"}
                    </span>

                    <div className="whitespace-nowrap text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      ⏳{" "}
                      {
                        service.estimatedDurationHours
                      }{" "}
                      {service.estimatedDurationHours ===
                      1
                        ? "Hour"
                        : "Hours"}
                    </div>
                  </div>

                  <h3 className="mb-1 text-base font-bold">
                    {service.title}
                  </h3>

                  <p className="mb-1 text-xs text-gray-400">
                    by{" "}
                    {service.providerId?.fullName ||
                      "Unknown provider"}
                  </p>

                  <p className="mb-3 text-xs text-gray-400">
                    {formatLocationType(
                      service.locationType
                    )}
                  </p>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <Link
                    to={`/services/${service._id}`}
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    View Details
                  </Link>

                  {currentUserId ? (
                    <Link
                      to={`/book-service/${service._id}`}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
                    >
                      Request Booking
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
                    >
                      Log In to Book
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseServicesPage;