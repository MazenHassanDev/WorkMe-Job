import StatusBadge from "./StatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function JobCard({ job, onView, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {job.title || "Untitled role"}
            </h3>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-1 truncate text-sm text-gray-600">
            {job.company || "—"}
            {job.location ? ` • ${job.location}` : ""}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Applied: {formatDate(job.applied_at)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onView?.(job)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(job)}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

