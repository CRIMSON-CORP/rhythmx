import { Check, Search } from "lucide-react";
import Icon from "@/components/icon";
import Image from "next/image";

export default async function BillingPage() {
  const showEmpty = false;

  // Billing history data coming from the server
  const billingHistory = showEmpty
    ? []
    : [
        {
          plan: "Kickstart",
          date: "Jan 6, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Rhythm Elite",
          date: "Jan 4, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Rhythm Elite",
          date: "Jan 5, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
        {
          plan: "Kickstart",
          date: "Jan 2, 2022",
          amount: "$847.00",
          card: "***8879",
          status: "Paid",
        },
      ];

  return (
    <div className="flex flex-col h-full">
      {/* Cards Section */}
      <div className="flex flex-col gap-3 px-3 md:px-6 pb-4">
        <h3 className="font-medium">Cards</h3>
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10.5 rounded-xl bg-brand-orange flex items-center justify-center text-white shrink-0">
              <Icon name="master-card" size={27} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="font-medium text-default">Mastercard</h4>
              <p className="text-xs font-medium text-border-default-secondary">***8879</p>
            </div>
          </div>

          <a href="#" className="self-start text-brand-blue text-xs font-medium hover:underline">
            Update Card
          </a>
        </div>
      </div>

      <div className="px-3 md:px-8 py-4 flex flex-col gap-3 flex-1 overflow-auto">
        {/* Billing History Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Billing History</h3>

          {/* If populated, show the search input; if empty, show Help? */}
          {billingHistory.length > 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-default-tertiary w-full max-w-82">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search history by date, card or plan"
                className="bg-transparent outline-none w-full text-sm font-medium placeholder-grey text-default"
              />
            </div>
          ) : (
            <a href="#" className="text-xs text-brand-blue font-bold hover:underline">
              Help?
            </a>
          )}
        </div>

        {/* Billing History Table / Empty State */}
        {billingHistory.length === 0 ? (
          <div className="flex-1 bg-white border border-black/5 rounded-2xl flex flex-col gap-8 items-center justify-center py-16 px-6 text-center">
            <Image
              src="/images/old-computer-with-sprouted-clover.png"
              alt="old computer with sprouted clover"
              width={86}
              height={74}
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-medium">No billing history</h4>
              <p className="text-black/50 max-w-sm font-medium leading-relaxed">
                You currently do not have any billing history yet, but if you do it will show up
                here
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse overflow-auto">
                <thead>
                  <tr className="border-b border-black/5 font-medium text-default/50">
                    <th className="py-4 px-6">Plan</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Card</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/3 overflow-auto">
                  {billingHistory.map((history, idx) => (
                    <tr
                      key={idx}
                      className="text-xs text-default font-medium hover:bg-black/1 transition-colors"
                    >
                      <td className="py-4.5 px-6">{history.plan}</td>
                      <td className="py-4.5 px-6">{history.date}</td>
                      <td className="py-4.5 px-6">{history.amount}</td>
                      <td className="py-4.5 px-6">{history.card}</td>
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-default-secondary">
                          <Check size={16} className="text-positive-tertiary" />
                          {history.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
