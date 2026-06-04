"use client";
import useNewReleaseStore, { newReleaseStoreTitles } from "@/store/new-release-store";

function NewSinglePage() {
  const currentStep = useNewReleaseStore((state) => state.currentStep);
  return (
    <div className="grow">
      {newReleaseStoreTitles.map((item, index) => {
        const Component = item.Component;
        if (!Component || currentStep !== index) return null;
        return <Component key={index} />;
      })}
    </div>
  );
}

export default NewSinglePage;
