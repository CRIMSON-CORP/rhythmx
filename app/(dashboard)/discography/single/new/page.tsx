"use client";
import useNewReleaseStore, { newReleaseStoreTitles } from "@/store/new-release-store";

function NewSinglePage() {
  const currentStep = useNewReleaseStore((state) => state.currentStep);
  return (
    <div>
      {newReleaseStoreTitles.map((item, index) => {
        const Component = item.Componenet;
        if (!Component) return null;
        return (
          <div key={index} hidden={currentStep !== index}>
            <Component />
          </div>
        );
      })}
    </div>
  );
}

export default NewSinglePage;

