export default function ClaimStatusCircles({
  claims,
  month,
}: {
  claims: any[];
  month: string;
}) {
  const statuses = [
    { label: "PENDING", color: "#fbbf24", count: 0 },
    { label: "APPROVED", color: "#22c55e", count: 0 },
    { label: "REJECTED", color: "#6b7280", count: 0 },
    { label: "CANCELLED", color: "#ec4899", count: 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statuses.map(({ label, color, count }) => (
        <div key={label} className="text-center">
          <div className="relative mx-auto h-24 w-24">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset="75"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color }}>
                {count}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}
