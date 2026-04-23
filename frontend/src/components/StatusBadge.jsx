const STYLES = {
  applied: "bg-blue-50 text-blue-700 ring-blue-600/20",
  interview: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
  offer: "bg-green-50 text-green-700 ring-green-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  withdrawn: "bg-gray-100 text-gray-700 ring-gray-600/20",
};

const LABELS = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export default function StatusBadge({ status }) {
  const key = (status || "applied").toLowerCase();
  const className = STYLES[key] || STYLES.applied;
  const label = LABELS[key] || key;
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

