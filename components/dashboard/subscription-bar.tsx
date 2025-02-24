export default function SubscriptionBar({
  subscriptions,
}: {
  subscriptions: any;
}) {
  const modules = ["TMS", "PAY", "LEAVE", "CLAIM", "HR", "APPRAISAL"];

  return (
    <div className="bg-pink-50 px-4 py-2">
      <div className="flex flex-wrap gap-2">
        {modules.map((module) => (
          <div key={module} className="text-xs text-red-600">
            {`INFO-${module} subscription will expire in 6 day(s)`}
          </div>
        ))}
      </div>
    </div>
  );
}
