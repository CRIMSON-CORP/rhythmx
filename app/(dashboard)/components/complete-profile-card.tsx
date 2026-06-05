import Image from "next/image";
import Icon from "../../../components/icon";
import Link from "next/link";

function CompletProfileCard() {
  return (
    <div className="bg-brand-orange outline outline-default-default rounded-30 p-4 flex flex-col gap-6 w-full max-w-57">
      <header className="flex items-center justify-between">
        <Icon name="zap" size={32} className="text-white" />
        <button>
          <Icon name="cancel" size={12} className="text-white" />
        </button>
      </header>
      <div className="grow flex items-center justify-center">
        <Image
          src="/images/box-with-toy-items.png"
          alt="Complet Profile Card"
          width={128.53}
          height={112.64}
        />
      </div>
      <div className="flex flex-col gap-1 text-white">
        <h2 className="text-white font-medium leading-tight">Let&apos;s blow things up 💣</h2>
        <p className="text-xs">Start with setting up your account</p>
        <Link href="/profile" className="flex items-center gap-2 text-xs">
          <span>Complete Profile</span>
          <Icon name="arrow-up-right" size={16} className="text-default" />
        </Link>
      </div>
    </div>
  );
}

export default CompletProfileCard;
