"use client";
import { Funnel } from "lucide-react";
import { useSearchParams } from "next/navigation";

const data = [15, 21, 6, 10, 9, 20, 23, 10, 3, 24, 16, 22, 4, 5];

function Earnings() {
  const searchParams = useSearchParams();
  const timeSort = searchParams.get("time-sort");
  let lastDays = "30 Days";
  switch (timeSort) {
    case "daily":
      lastDays = "1 Day";
      break;
    case "weekly":
      lastDays = "7 Days";
      break;
    case "monthly":
      lastDays = "30 Days";
      break;
    case "yearly":
      lastDays = "12 months";
      break;
  }

  const dataMax = Math.max(...data);

  return (
    <div className="@container min-w-80 bg-white rounded-30 grow-2 flex flex-col gap-6">
      <header className="flex items-center justify-between gap-1 text-default-tertiary px-4 py-5">
        <h2 className="font-medium leading-tight">Earnings</h2>
        <Funnel size={24} />
      </header>
      <div className="flex @max-md:flex-col-reverse grow gap-6 items-end px-6 pb-6">
        <div className="flex @max-md:self-stretch items-end justify-between grow h-full min-h-27 gap-1.5">
          {data.map((amount, index) => (
            <div key={index} className="h-full flex items-end grow group">
              <div
                style={{ height: (amount / dataMax) * 100 + "%" }}
                className="bg-brand-orange/5 rounded-full grow group-hover:bg-brand-orange/30 transition-colors"
              ></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col py-6 gap-3">
          <span className="text-default/40 font-medium leading-tight">
            Total earning ({lastDays})
          </span>
          <span className="text-[32px] font-medium leading-tight">
            $394,000<span className="text-default-tertiary">.00</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
