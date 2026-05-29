"use client";
import useOnBoardingStore, { stepsComponent } from "@/store/onboarding-store";

function Page() {
  const currentStep = useOnBoardingStore((state) => state.currentStep);
  return (
    <div>
      {stepsComponent.map((Component, index) => (
        <div key={index} hidden={currentStep !== index}>
          <Component />
        </div>
      ))}
    </div>
  );
}

export default Page;
