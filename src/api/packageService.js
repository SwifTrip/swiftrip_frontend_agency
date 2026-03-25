import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeApiError = (err, fallbackMessage) => {
  const data = err?.response?.data;

  return {
    message: data?.message || err?.message || fallbackMessage,
    fieldErrors: Array.isArray(data?.fieldErrors) ? data.fieldErrors : [],
  };
};

export async function getPackages() {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    throw normalizeApiError(err, "Failed to fetch packages");
  }
}

// Get single package by ID
export async function getPackageById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/package/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    throw normalizeApiError(err, "Failed to fetch package");
  }
}

// src/api/packageService.js
export const createPackage = async (packageData) => {
  console.log("API Service - packageData received:", {
    departureDate: packageData.departureDate,
    arrivalDate: packageData.arrivalDate,
    isPublic: packageData.isPublic,
    maxGroupSize: packageData.maxGroupSize,
  });

  const formData = new FormData();

  formData.append("companyId", packageData.companyId);
  formData.append("title", packageData.title);
  formData.append(
    "description",
    packageData.description || "A beautiful tour package",
  );
  formData.append("category", packageData.category);
  formData.append("basePrice", packageData.basePrice);
  formData.append("currency", packageData.currency);
  // Group tour fields
  if (
    packageData.maxGroupSize !== undefined &&
    packageData.maxGroupSize !== null
  ) {
    formData.append("maxGroupSize", packageData.maxGroupSize);
  }
  if (
    packageData.minGroupSize !== undefined &&
    packageData.minGroupSize !== null
  ) {
    formData.append("minGroupSize", packageData.minGroupSize);
  }
  if (packageData.isPublic !== undefined && packageData.isPublic !== null) {
    formData.append("isPublic", packageData.isPublic);
  }
  if (packageData.departureDate) {
    formData.append("departureDate", packageData.departureDate);
  }
  if (packageData.arrivalDate) {
    formData.append("arrivalDate", packageData.arrivalDate);
  }
  if (packageData.bookingDeadline) {
    formData.append("bookingDeadline", packageData.bookingDeadline);
  }
  formData.append("status", packageData.status);

  // SAFE JSON
  formData.append("includes", JSON.stringify(packageData.includes || {}));
  // Itineraries with day-level timing & transports
  formData.append("itineraries", JSON.stringify(packageData.itineraries || []));
  // Shared stays across days
  formData.append("tourStays", JSON.stringify(packageData.tourStays || []));
  // Shared transports at package level
  formData.append(
    "tourTransports",
    JSON.stringify(packageData.tourTransports || []),
  );
  formData.append("fromLocation", packageData.fromLocation);
  formData.append("toLocation", packageData.toLocation);
  // Media
  packageData.media?.forEach((m) => m.file && formData.append("media", m.file));

  try {
    const res = await axios.post(`${API_BASE_URL}/package/create`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    throw normalizeApiError(err, "Failed to create package");
  }
};

// Update package
export const updatePackage = async (id, packageData) => {
  try {
    console.log("=== UPDATE PACKAGE START ===");
    console.log("Package ID:", id);
    console.log("Package Data to send:", packageData);

    const formData = new FormData();

    if (packageData.companyId)
      formData.append("companyId", packageData.companyId);
    if (packageData.title) formData.append("title", packageData.title);
    if (packageData.description)
      formData.append("description", packageData.description);
    if (packageData.category) formData.append("category", packageData.category);

    if (packageData.basePrice !== undefined)
      formData.append("basePrice", packageData.basePrice);
    if (packageData.currency) formData.append("currency", packageData.currency);

    if (
      packageData.maxGroupSize !== undefined &&
      packageData.maxGroupSize !== null
    )
      formData.append("maxGroupSize", packageData.maxGroupSize);
    if (
      packageData.minGroupSize !== undefined &&
      packageData.minGroupSize !== null
    )
      formData.append("minGroupSize", packageData.minGroupSize);
    if (packageData.isPublic !== undefined && packageData.isPublic !== null)
      formData.append("isPublic", packageData.isPublic);
    if (packageData.departureDate)
      formData.append("departureDate", packageData.departureDate);
    if (packageData.arrivalDate)
      formData.append("arrivalDate", packageData.arrivalDate);
    if (packageData.bookingDeadline)
      formData.append("bookingDeadline", packageData.bookingDeadline);
    if (packageData.status) formData.append("status", packageData.status);

    if (packageData.includes !== undefined)
      formData.append("includes", JSON.stringify(packageData.includes || {}));
    if (packageData.itineraries !== undefined) {
      console.log("Sending itineraries:", packageData.itineraries);
      formData.append(
        "itineraries",
        JSON.stringify(packageData.itineraries || []),
      );
    }
    if (packageData.tourStays !== undefined)
      formData.append("tourStays", JSON.stringify(packageData.tourStays || []));
    if (packageData.tourTransports !== undefined)
      formData.append(
        "tourTransports",
        JSON.stringify(packageData.tourTransports || []),
      );
    if (packageData.keepMedia !== undefined)
      formData.append("keepMedia", JSON.stringify(packageData.keepMedia || []));

    if (packageData.fromLocation)
      formData.append("fromLocation", packageData.fromLocation);
    if (packageData.toLocation)
      formData.append("toLocation", packageData.toLocation);

    // New media uploads
    packageData.media?.forEach(
      (m) => m.file && formData.append("media", m.file),
    );

    console.log(
      "FormData ready, sending to:",
      `${API_BASE_URL}/package/update/${id}`,
    );

    const res = await axios.put(
      `${API_BASE_URL}/package/update/${id}`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log("✅ Update response SUCCESS:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Update API error full error:", err);
    console.error("❌ Error response data:", err.response?.data);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error status:", err.response?.status);
    throw normalizeApiError(err, "Failed to update package");
  }
};

// Delete package
export async function deletePackage(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/package/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    throw normalizeApiError(err, "Failed to delete package");
  }
}

// Extract package information from PDF using Gemini AI
export const extractPackageFromPDF = async (pdfFile) => {
  try {
    const formData = new FormData();
    formData.append("pdf", pdfFile);

    console.log("📤 Sending PDF to backend:", pdfFile.name);
    console.log("📤 File size:", (pdfFile.size / 1024).toFixed(2), "KB");

    const res = await axios.post(
      `${API_BASE_URL}/package/extract-from-pdf`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log("📥 Response received from backend");
    console.log("📥 Extracted data keys:", Object.keys(res.data.data || {}));
    console.log("📥 Full response:", res.data);

    return res.data.data; // Return the extracted data
  } catch (err) {
    console.error("❌ API Error:", err.response?.data || err.message);
    console.error("❌ Full error:", err);
    throw normalizeApiError(err, "Failed to extract package from PDF");
  }
};
