import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import {
  createJob,
  deleteJob,
  getJobs,
  summarizeDesc,
  updateJob,
} from "../api/jobs";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import JobCard from "../components/JobCard";
import JobFormModal from "../components/JobFormModal";
import { useAuth } from "../context/AuthContext";

const STATUS_ORDER = ["applied", "interview", "offer", "rejected", "withdrawn"];
const STATUS_LABELS = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { accessToken, refreshToken, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState(() => ({
    applied: true,
    interview: true,
    offer: true,
    rejected: true,
    withdrawn: true,
  }));

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) navigate("/login");
  }, [accessToken, navigate]);

  const refreshJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getJobs();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredJobs = useMemo(() => {
    const q = normalize(query);
    return jobs.filter((j) => {
      const statusKey = (j.status || "applied").toLowerCase();
      if (!statusFilters[statusKey]) return false;

      if (!q) return true;
      const hay = `${j.title || ""} ${j.company || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, query, statusFilters]);

  const grouped = useMemo(() => {
    const byStatus = new Map();
    for (const s of STATUS_ORDER) byStatus.set(s, []);
    for (const j of filteredJobs) {
      const key = (j.status || "applied").toLowerCase();
      if (!byStatus.has(key)) byStatus.set(key, []);
      byStatus.get(key).push(j);
    }
    return byStatus;
  }, [filteredJobs]);

  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutUser(refreshToken);
    } catch {
      // best-effort: still clear locally
    } finally {
      logout();
      navigate("/login");
    }
  };

  const openEdit = (job) => {
    setActiveJob(job);
    setEditOpen(true);
  };

  const openDelete = (job) => {
    setActiveJob(job);
    setDeleteOpen(true);
  };

  const handleCreateSave = async (payload) => {
    await createJob(payload);
    await refreshJobs();
  };

  const handleEditSave = async (payload) => {
    if (!activeJob?.id) return;
    await updateJob(activeJob.id, payload);
    await refreshJobs();
  };

  const handleSummarize = async (description) => {
    const res = await summarizeDesc(description);
    return res?.data?.summary ?? "";
  };

  const handleDeleteConfirm = async () => {
    if (!activeJob?.id) return;
    setDeleteLoading(true);
    try {
      await deleteJob(activeJob.id);
      setDeleteOpen(false);
      setActiveJob(null);
      await refreshJobs();
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleStatus = (key) => {
    setStatusFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <aside className="w-80 shrink-0 border-r border-gray-200 bg-white">
          <div className="flex h-full flex-col p-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">WorkMe</h1>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Title or company..."
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">
                  Status filters
                </p>
                <div className="mt-3 space-y-2">
                  {STATUS_ORDER.map((key) => (
                    <label
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <span>{STATUS_LABELS[key]}</span>
                      <input
                        type="checkbox"
                        checked={!!statusFilters[key]}
                        onChange={() => toggleStatus(key)}
                        className="h-4 w-4 accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Applications
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Track, edit, and summarise your job applications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add New Job
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                Loading applications...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
                <button
                  type="button"
                  onClick={refreshJobs}
                  className="ml-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
                >
                  Retry
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-sm font-medium text-gray-800">
                  No applications found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or status filters.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {STATUS_ORDER.map((statusKey) => {
                  const items = grouped.get(statusKey) || [];
                  if (items.length === 0) return null;
                  return (
                    <section key={statusKey}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {STATUS_LABELS[statusKey]}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {items.length}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {items.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            onView={openEdit}
                            onDelete={openDelete}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <JobFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        onSave={handleCreateSave}
        onSummarize={handleSummarize}
      />

      <JobFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setActiveJob(null);
        }}
        mode="edit"
        initialJob={activeJob}
        onSave={handleEditSave}
        onSummarize={handleSummarize}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => {
          if (deleteLoading) return;
          setDeleteOpen(false);
          setActiveJob(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}