import React, { useState } from "react";

export default function MediaUploadStep({
  formData,
  updateFormData,
  onNext,
  onPrev,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [fileFeedback, setFileFeedback] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    const maxFiles = 10;
    const maxSize = 5 * 1024 * 1024; // 5MB

    setMediaError("");
    setFileFeedback("");

    if (formData.media.length + files.length > maxFiles) {
      setMediaError(`Maximum ${maxFiles} images are allowed.`);
      return;
    }

    setUploading(true);
    const newMedia = [];
    let processedCount = 0;

    for (let file of files) {
      if (file.size > maxSize) {
        setMediaError(`${file.name} is too large. Maximum size is 5MB.`);
        processedCount++;
        continue;
      }

      if (!file.type.startsWith("image/")) {
        setMediaError(`${file.name} is not a valid image file.`);
        processedCount++;
        continue;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        newMedia.push({
          file: file,
          preview: reader.result,
          name: file.name,
        });
        processedCount++;

        if (processedCount === files.length) {
          if (newMedia.length > 0) {
            updateFormData({ media: [...formData.media, ...newMedia] });
            setFileFeedback(`${newMedia.length} image(s) added successfully.`);
          }
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const removed = formData.media[index];
    const updatedMedia = formData.media.filter((_, i) => i !== index);
    let updatedKeepMedia = formData.keepMedia;

    // If removing an existing media, also remove from keep list
    if (removed?.isExisting && removed?.url) {
      updatedKeepMedia = (formData.keepMedia || []).filter(
        (u) => u !== removed.url,
      );
    }

    updateFormData({ media: updatedMedia, keepMedia: updatedKeepMedia });
    setFileFeedback("Image removed.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMediaError("");

    // Validation: Check if at least one image is uploaded
    if (formData.media.length === 0) {
      setMediaError("Please upload at least one image for your package.");
      return;
    }

    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 bg-white rounded-lg w-full"
    >
      <style>{`
        ::placeholder {
          color: #D1D5DB;
          opacity: 1;
        }
      `}</style>

      <div className="mb-5">
        <h3 className="text-xl font-semibold text-slate-800">
          Upload Package Images
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Add up to 10 high-quality images to showcase your tour package
        </p>
      </div>

      {mediaError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {mediaError}
        </div>
      )}

      {fileFeedback && !mediaError && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {fileFeedback}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
          dragActive
            ? "border-orange-500 bg-orange-50/70"
            : mediaError
              ? "border-red-300 bg-red-50/60"
              : "border-slate-300 bg-slate-50/70 hover:border-slate-400 hover:bg-slate-100/80"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className="text-lg font-medium text-gray-700 mb-2">
            Drag and drop images here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse from your computer
          </p>

          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Choose Files
          </label>

          <p className="text-xs text-slate-500 mt-4">
            Maximum 10 images, each up to 5MB
          </p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}
      </div>

      {/* Uploaded Images Grid */}
      {formData.media.length > 0 && (
        <div className="mt-7">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">
              Uploaded Images ({formData.media.length}/10)
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.media.map((media, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={media.preview || media.url}
                  alt={media.name || "Existing image"}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-7 pt-5 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-sm hover:shadow"
        >
          Next →
        </button>
      </div>
    </form>
  );
}
