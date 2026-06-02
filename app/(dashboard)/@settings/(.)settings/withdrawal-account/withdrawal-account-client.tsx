"use client";

import * as React from "react";
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui";
import Icon from "@/components/icon";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";

interface WithdrawalAccountClientProps {
  accountExists: boolean;
}

const BANKS = [
  {
    id: "moniepoint",
    name: "Moniepoint",
    fullName: "Moniepoint Microfinance Bank",
    image: "/images/avatar.png",
  },
  { id: "access", name: "Access Bank", fullName: "Access Bank Plc", image: "/images/avatar.png" },
  { id: "gtco", name: "GTCO", fullName: "Guaranty Trust Bank", image: "/images/avatar.png" },
  {
    id: "polaris",
    name: "Polaris Bank",
    fullName: "Polaris Bank Nigeria",
    image: "/images/avatar.png",
  },
  { id: "uba", name: "UBA", fullName: "United Bank of Africa", image: "/images/avatar.png" },
  { id: "union", name: "Union Bank", fullName: "Union Bank Nigeria", image: "/images/avatar.png" },
];

export default function WithdrawalAccountClient({ accountExists }: WithdrawalAccountClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalStep, setModalStep] = React.useState<"select-bank" | "bank-details">("select-bank");
  const [selectedBank, setSelectedBank] = React.useState<(typeof BANKS)[0] | null>(null);

  // Form Fields
  const [accountNumber, setAccountNumber] = React.useState("");
  const [swiftCode, setSwiftCode] = React.useState("");
  const [iban, setIban] = React.useState("");
  const [bankAddress, setBankAddress] = React.useState("");

  // Search Filter
  const [searchQuery, setSearchQuery] = React.useState("");

  // Resolving Name state
  const [isResolvingName, setIsResolvingName] = React.useState(false);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear verification timer on unmount to prevent leaks
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleOpenModal = () => {
    setModalStep("select-bank");
    setSelectedBank(null);
    setAccountNumber("");
    setSwiftCode("");
    setIban("");
    setBankAddress("");
    setSearchQuery("");
    setIsResolvingName(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsModalOpen(true);
  };

  const handleSelectBank = (bank: (typeof BANKS)[0]) => {
    setSelectedBank(bank);
    setModalStep("bank-details");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank || accountNumber.length !== 10) return;

    // Only closes the modal, backend revalidation/actions handles data updates
    setIsModalOpen(false);
  };

  const filteredBanks = BANKS.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Button to open Modal */}
      {!accountExists ? (
        <Button variant="outline" onClick={handleOpenModal} className="w-fit">
          Add Account
          <Icon name="arrow-right" size={24} />
        </Button>
      ) : (
        <Button variant="outline" onClick={handleOpenModal} className="w-fit">
          Change your Bank
          <Icon name="arrow-right" size={24} />
        </Button>
      )}

      {/* Modal Dialog */}
      <DialogPrimitive.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col w-full max-w-115 max-h-[85vh] rounded-20 bg-white shadow-2xl duration-200 outline-none overflow-hidden data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
            <VisuallyHidden.Root>
              <DialogPrimitive.Title>Withdrawal Modal</DialogPrimitive.Title>
              <DialogPrimitive.Description>Withdrawal Modal</DialogPrimitive.Description>
            </VisuallyHidden.Root>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                {modalStep === "bank-details" && (
                  <button
                    onClick={() => setModalStep("select-bank")}
                    type="button"
                    className="p-1.5 rounded-full hover:bg-black/5 text-default transition-all mr-1 cursor-pointer"
                  >
                    <Icon name="chevron-left" size={18} />
                  </button>
                )}
                <DialogPrimitive.Title className="font-semibold text-default text-base">
                  Withdrawal Account
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close asChild>
                <button className="p-2 rounded-full hover:bg-black/5 text-default transition-all cursor-pointer">
                  <Icon name="cancel" size={20} />
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Modal Body */}
            {modalStep === "select-bank" ? (
              <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                <p className="text-sm text-default-tertiary">
                  Select the bank you like to link to your account
                </p>

                {/* Search */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F4F5F7] rounded-xl border border-black/2">
                  <Icon name="search" size={18} className="text-default-tertiary" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm text-default font-medium placeholder-default-tertiary"
                  />
                </div>

                {/* Bank List */}
                <div className="max-h-75 overflow-y-auto pr-1 flex flex-col gap-1 scrollbar-none">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => handleSelectBank(bank)}
                      type="button"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/3 transition-all text-left w-full group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <Image
                          src={bank.image}
                          alt={bank.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-black/5"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-default group-hover:text-brand-orange transition-colors">
                            {bank.name}
                          </h4>
                          <p className="text-xs text-default-tertiary">{bank.fullName}</p>
                        </div>
                      </div>
                      <Icon
                        name="chevron-right"
                        size={16}
                        className="text-default-tertiary opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  ))}
                  {filteredBanks.length === 0 && (
                    <div className="py-8 text-center text-sm text-default-tertiary">
                      No banks found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                {/* Selected Bank Preview */}
                <div className="flex items-center gap-3.5 p-3.5 bg-light-blue rounded-xl">
                  <Image
                    src={selectedBank?.image || ""}
                    alt={selectedBank?.name || ""}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-black/5"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-default">{selectedBank?.name}</h4>
                    <p className="text-xs text-default-tertiary">{selectedBank?.fullName}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Account Number */}
                  <Input
                    name="account-number"
                    label="Account Number"
                    placeholder="Account Number e.g 1234567890"
                    maxLength={10}
                    required
                    onChange={(event) => {
                      const val = event.target.value.replace(/\D/g, "");
                      setAccountNumber(val);

                      if (timerRef.current) {
                        clearTimeout(timerRef.current);
                        timerRef.current = null;
                      }

                      if (val.length === 10) {
                        setIsResolvingName(true);
                        timerRef.current = setTimeout(() => {
                          setIsResolvingName(false);
                        }, 1000);
                      } else {
                        setIsResolvingName(false);
                      }
                    }}
                  />

                  {/* Swift Code */}
                  <Input
                    name="swift-code"
                    label="Swift Code"
                    placeholder="Swift Code e.g 234129"
                    required
                    value={swiftCode}
                    onChange={(event) => setSwiftCode(event.target.value)}
                  />

                  {/* Bank IBAN */}
                  <Input
                    name="bank-iban"
                    label="Bank IBAN"
                    placeholder="Bank IBAN e.g 23432321111"
                    required
                    value={iban}
                    onChange={(event) => setIban(event.target.value)}
                  />

                  {/* Bank Address */}
                  <Input
                    name="bank-address"
                    label="Bank Address"
                    placeholder="Write your bank address"
                    required
                    value={bankAddress}
                    onChange={(event) => setBankAddress(event.target.value)}
                  />
                </div>

                {/* Submit button */}
                <Button type="submit" disabled={accountNumber.length !== 10 || isResolvingName}>
                  Done
                </Button>
              </form>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
