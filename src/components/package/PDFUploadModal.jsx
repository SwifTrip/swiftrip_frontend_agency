import { useState } from "react";
import { toast } from "react-toastify";
import {
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { extractPackageFromPDF } from "../../api/packageService";

export default function PDFUploadModal({ isOpen, onClose, onExtract }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF selected: " + selectedFile.name);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      toast.success("PDF selected: " + droppedFile.name);
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };

  const handleExtract = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setLoading(true);
    try {
      console.log("🔵 Extracting from PDF:", file.name);
      const data = await extractPackageFromPDF(file);

      console.log("✅ Extraction successful:", data);
      setPreview(data);
      toast.success("Package data extracted successfully!");
    } catch (error) {
      console.error("❌ Extraction error:", error);
      toast.error(
        "Failed to extract data: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onExtract(preview);
      setFile(null);
      setPreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Extract Package from PDF
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!preview ? (
            <>
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-500 transition cursor-pointer"
              >
                <DocumentTextIcon className="w-12 h-12 mx-auto text-orange-500 mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your PDF here or click to select
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-input"
                />
                <label htmlFor="pdf-input">
                  <span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700 transition font-medium">
                    Select PDF File
                  </span>
                </label>
              </div>

              {/* Selected File Info */}
              {file && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">
                    Selected: {file.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>💡 Tip:</strong> Upload a PDF with your tour package
                  details. The system will automatically extract title,
                  description, itinerary, pricing, and more.
                </p>
              </div>

              {/* Extract Button */}
              <button
                onClick={handleExtract}
                disabled={!file || loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Extracting data... (This may take 10-30 seconds)
                  </>
                ) : (
                  "📄 Extract Package Data"
                )}
              </button>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">
                    Extraction Successful!
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    Package information has been extracted. Please review below
                    and click "Use This Data" to proceed.
                  </p>
                </div>
              </div>

              {/* Preview Data */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Extracted Information Preview
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 max-h-60 overflow-y-auto">
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Title
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {preview.title || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Description
                      </p>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {preview.description || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Category
                      </p>
                      <p className="text-sm text-gray-900">
                        {preview.category || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Currency
                      </p>
                      <p className="text-sm text-gray-900">
                        {preview.currency || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Base Price
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {preview.basePrice || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Group Size
                      </p>
                      <p className="text-sm text-gray-900">
                        {preview.minGroupSize || "—"} -{" "}
                        {preview.maxGroupSize || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        From
                      </p>
                      <p className="text-sm text-gray-900">
                        {preview.fromLocation || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        To
                      </p>
                      <p className="text-sm text-gray-900">
                        {preview.toLocation || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Days & Stays */}
                  {(preview.itineraries?.length > 0 ||
                    preview.tourStays?.length > 0) && (
                    <div className="pt-2 border-t border-gray-200">
                      {preview.itineraries?.length > 0 && (
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Days:</span>{" "}
                          {preview.itineraries.length}
                        </p>
                      )}
                      {preview.tourStays?.length > 0 && (
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Stays:</span>{" "}
                          {preview.tourStays.length}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Try Another PDF
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  ✓ Use This Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
