import { EarningItem } from "./earning-item";

interface EarningHistoryProps {
  history?: DashboardEarningHistoryItem[];
}

function EarningHistory({ history }: EarningHistoryProps) {
  const items = history && history.length > 0 ? history.slice(0, 4) : [];

  return (
    <div className="bg-white rounded-30 flex flex-col w-full md:basis-84.5">
      <header className="flex items-center justify-between gap-1 text-default-tertiary px-4 py-5">
        <h2 className="font-medium leading-tight">Earning History</h2>
      </header>
      {items.length > 0 ? (
        <ul>
          {items.map((earning, idx) => (
            <EarningItem key={earning.id || idx} {...earning} />
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-48 text-center text-default-tertiary">
          <p className="text-sm font-medium">No earning history recorded yet</p>
        </div>
      )}
    </div>
  );
}

export default EarningHistory;
