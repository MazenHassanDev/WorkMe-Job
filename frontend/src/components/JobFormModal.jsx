import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

function pickEditableFields(job) {
  return {
    title: job?.title ?? "",
    company: job?.company ?? "",
    location: job?.location ?? "",
    job_url: job?.job_url ?? "",
    description: job?.description ?? "",
    status: job?.status ?? "applied",
    applied_at: job?.applied_at ?? "",
    ai_summary: job?.ai_summary ?? "",
  };
}

export default function JobFormModal({
  open,
  onClose,
  mode, // "create" | "edit"
  initialJob,
  onSave,
  onSummarize,
}) {
  const title = mode === "edit" ? "View / Edit Job" : "Add New Job";
  const [form, setForm] = useState(() => pickEditableFields(initialJob));
  const [saving, setSaving] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(pickEditableFields(initialJob));
    setError("");
    setSaving(false);
    setSummarizing(false);
  }, [open, initialJob]);

  const canSummarize = useMemo(
    () => (form.description || "").trim().length >= 20,
    [form.description]
  );

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave?.({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        job_url: form.job_url.trim(),
        description: form.description,
        status: form.status,
        ai_summary: form.ai_summary || null,
        applied_at: form.applied_at || null,
      });
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data
          ? Object.values(err.response.data).flat().join(" ")
          : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!canSummarize || summarizing) return;
    setSummarizing(true);
    setError("");
    try {
      const summary = await onSummarize?.(form.description);
      if (typeof summary === "string") setField("ai_summary", summary);
    } catch (err) {
      const msg =
        err?.response?.data
          ? Object.values(err.response.data).flat().join(" ")
          : "Failed to summarize. Please try again later.";
      setError(msg);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="job-form"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Frontend Engineer"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <input
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Acme Inc."
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Remote"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Job URL</label>
            <input
              value={form.job_url}
              onChange={(e) => setField("job_url", e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Applied date
            </label>
            <input
              type="date"
              value={form.applied_at}
              onChange={(e) => setField("applied_at", e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <button
              type="button"
              onClick={handleSummarize}
              disabled={!canSummarize || summarizing}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                canSummarize
                  ? "Generate an AI summary"
                  : "Add a bit more description to summarize"
              }
            >
              {summarizing ? "Summarising..." : "Summarise"}
            </button>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="min-h-32 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            AI Summary
          </label>
          <textarea
            value={form.ai_summary || ""}
            readOnly
            className="min-h-24 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
            placeholder="Click Summarise to generate a summary..."
          />
          <p className="text-xs text-gray-500">
            Summary generation is rate-limited by the backend.
          </p>
        </div>
      </form>
    </Modal>
  );
}

