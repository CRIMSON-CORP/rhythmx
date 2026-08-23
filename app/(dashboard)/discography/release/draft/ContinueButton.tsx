import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

function ContinueButton({
  disabled,
  pending,
  onClick,
}: {
  disabled?: boolean;
  pending?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="orange"
      type={onClick ? "button" : "submit"}
      disabled={disabled || pending}
      onClick={onClick}
      className="group-has-invalid/form:opacity-50 group-not-has-invalid/form:opacity-100"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Uploading...</span>
        </>
      ) : (
        <>
          <span>Continue</span>
          <ArrowRight size={16} />
        </>
      )}
    </Button>
  );
}

export default ContinueButton;
