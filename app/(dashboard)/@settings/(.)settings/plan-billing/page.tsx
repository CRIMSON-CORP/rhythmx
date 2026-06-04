import Icon from "@/components/icon";

const PLANS = [
  {
    name: "Kickstart",
    price: "$20",
    period: "/ Year",
    desc: "This plan is perfect for upcoming artists who want to get started on the platform.",
    buttonText: "Upgrade",
    features: [
      "1 Artist",
      "Unlimited Releases (DSPs)",
      "Schedule Release Date",
      "1-10 Days Release Lead Time",
    ],
  },
  {
    name: "Rhythm Elite",
    price: "$28",
    period: "/ Year",
    desc: "Most popular pricing plans for artists and musicians who wants that global reach.",
    buttonText: "Upgrade",
    features: [
      "1 Artist",
      "Unlimited Releases (DSPs)",
      "Schedule Release Date",
      "1-10 Days Release Lead Time",
    ],
  },
  {
    name: "Label Master",
    price: "Custom",
    period: "",
    desc: "It depends on the number of artists accounts to be managed, offering a more suitable service.",
    buttonText: "Contact us",
    features: [
      "Unlimited Artist Management",
      "Unlimited Releases",
      "Unlimited Royalty",
      "All Kickstart and Elite features",
      "Dedicated Account Manager",
      "Comprehensive Analytics",
    ],
  },
];

export default function ManagePlanPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Active Plan */}
      <div className="flex flex-col gap-4 px-3 md:px-8 pb-4">
        <h3 className="font-medium">Active Plan</h3>
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center text-white shrink-0">
              <Icon name="loyalty-card" size={27} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-medium text-border-default-secondary">Kickstart Plan</h4>
              <p className="font-medium text-default">Expires on 01 September, 2025</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5 pr-1">
            <span className="text-xs font-medium text-border-default-secondary">Price</span>
            <span className="font-medium text-default">$20</span>
          </div>
        </div>
      </div>

      <div className="px-3 md:px-8 pb-4 flex flex-col gap-3">
        {/* Grid Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">All Plans</h3>
          <a href="#" className="text-xs text-brand-blue font-bold hover:underline">
            Help?
          </a>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white rounded-20">
          {PLANS.map((plan) => (
            <div key={plan.name} className="rounded-2xl flex flex-col overflow-hidden p-3">
              {/* Top Info */}
              <div className="p-4 flex flex-col gap-2">
                <h4 className="font-medium text-default">{plan.name}</h4>
                <div className="flex items-baseline gap-0.5 text-sm leading-none text-default font-mono">
                  <span>{plan.price}</span>
                  {plan.period && <span>{plan.period}</span>}
                </div>
                <p className="text-xs text-default-tertiary font-medium">{plan.desc}</p>

                <button
                  type="button"
                  className="w-fit mt-1 py-2 px-4 rounded-xl border border-brand-orange text-brand-orange font-bold text-xs hover:bg-brand-orange/5 active:scale-98 transition-all cursor-pointer"
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Bottom Features List */}
              <div className="bg-page-background p-4 flex flex-col gap-3 rounded-20">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-default-tertiary">
                    <Icon name="asteriks" className="text-brand-orange" size={12} />
                    <span className="leading-tight text-default-tertiary font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
