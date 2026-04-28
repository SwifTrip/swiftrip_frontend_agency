import React, { useEffect, useMemo, useState } from "react";
import {
  createKnowledgeFaq,
  createKnowledgeNote,
  deleteKnowledgeFaq,
  deleteKnowledgeNote,
  listKnowledgeFaqs,
  listKnowledgeNotes,
} from "../../api/knowledgeService";

const Tabs = {
  NOTES: "notes",
  FAQS: "faqs",
};

export default function KnowledgeBasePage() {
  const [tab, setTab] = useState(Tabs.NOTES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [notes, setNotes] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const [scope, setScope] = useState({ bookingId: "", tourPackageId: "" });

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  const scopeParams = useMemo(() => {
    const bookingId = scope.bookingId?.trim() || undefined;
    const tourPackageId = scope.tourPackageId?.trim() || undefined;
    return { bookingId, tourPackageId };
  }, [scope]);

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const [n, f] = await Promise.all([
        listKnowledgeNotes(scopeParams),
        listKnowledgeFaqs(scopeParams),
      ]);
      setNotes(n);
      setFaqs(f);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load knowledge base");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeParams.bookingId, scopeParams.tourPackageId]);

  const handleCreateNote = async () => {
    if (!noteContent.trim()) return;
    setError("");
    setLoading(true);
    try {
      await createKnowledgeNote({
        title: noteTitle || undefined,
        content: noteContent,
        ...scopeParams,
      });
      setNoteTitle("");
      setNoteContent("");
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Create note failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaq = async () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    setError("");
    setLoading(true);
    try {
      await createKnowledgeFaq({
        question: faqQ,
        answer: faqA,
        ...scopeParams,
      });
      setFaqQ("");
      setFaqA("");
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Create FAQ failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload documents, add notes, and maintain FAQs used by the booking-scoped AI chat.
          </p>
        </div>
      </div>

      {/* <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:max-w-[520px]">
            <div>
              <label className="text-xs font-semibold text-gray-600">
                Booking scope (optional)
              </label>
              <input
                value={scope.bookingId}
                onChange={(e) => setScope((s) => ({ ...s, bookingId: e.target.value }))}
                placeholder="bookingId"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">
                Package scope (optional)
              </label>
              <input
                value={scope.tourPackageId}
                onChange={(e) => setScope((s) => ({ ...s, tourPackageId: e.target.value }))}
                placeholder="tourPackageId"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="h-10 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 font-medium">{error}</div>
        )}
      </div> */}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-1 border-b border-gray-200 px-3 py-2">
          {Object.values(Tabs).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t ? "bg-orange-50 text-orange-800" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === Tabs.NOTES ? "Notes" : "FAQs"}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === Tabs.NOTES && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-600">Title (optional)</label>
                  <input
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Meeting point"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Content</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write the note content..."
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleCreateNote}
                  disabled={loading || !noteContent.trim()}
                  className="h-10 px-4 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-60"
                >
                  Add note
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Notes ({notes.length})
                </h3>
                <div className="space-y-2">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border border-gray-200 px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">
                            {n.title || "Note"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                            {n.content}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await deleteKnowledgeNote(n.id);
                              await refresh();
                            } catch (e) {
                              setError(e?.response?.data?.error || e?.message || "Delete failed");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <div className="text-sm text-gray-500">No notes yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === Tabs.FAQS && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Question</label>
                  <input
                    value={faqQ}
                    onChange={(e) => setFaqQ(e.target.value)}
                    placeholder="e.g. Can I cancel?"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Answer</label>
                  <input
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                    placeholder="e.g. Yes, cancellation is allowed up to..."
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleCreateFaq}
                  disabled={loading || !faqQ.trim() || !faqA.trim()}
                  className="h-10 px-4 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-60"
                >
                  Add FAQ
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  FAQs ({faqs.length})
                </h3>
                <div className="space-y-2">
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-lg border border-gray-200 px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">
                            Q: {f.question}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            A: {f.answer}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await deleteKnowledgeFaq(f.id);
                              await refresh();
                            } catch (e) {
                              setError(e?.response?.data?.error || e?.message || "Delete failed");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {faqs.length === 0 && (
                    <div className="text-sm text-gray-500">No FAQs yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

