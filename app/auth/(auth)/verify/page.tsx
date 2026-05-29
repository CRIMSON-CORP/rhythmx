import Input from "../Input";
import TermsPolicyText from "../TermsPolicyText";

async function Page({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const { email } = await searchParams;
  return (
    <div className="flex flex-col max-w-107.5 m-auto gap-8">
      <div className="space-y-1 text-2xl font-semibold text-center">
        <h1>Verification</h1>
        <p className="text-black/50">
          Enter the code we sent to <span className="text-black">{email}</span>
        </p>
      </div>
      <form action="" className="space-y-6">
        <Input
          name="email"
          label="Email"
          type="email"
          defaultValue={email}
          placeholder="Enter your email address"
        />
        <Input name="otp" label="OTP" type="number" placeholder="Enter OTP here" />
        <button className="bg-black outline outline-black p-4 rounded-10 text-white w-full">
          Verify
        </button>
      </form>
      <TermsPolicyText />
    </div>
  );
}

export default Page;
