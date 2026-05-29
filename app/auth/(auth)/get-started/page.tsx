function Page() {
  return (
    <div className="flex flex-col max-w-107.5 m-auto gap-8 py-24">
      <div className="space-y-1 text-2xl font-semibold max-w-85.25">
        <h1>Hey, you could be the next BIG thing</h1>
        <p className="text-black/50">Get started</p>
      </div>
      <div className="flex flex-col gap-3 font-medium *:bg-white *:outline *:outline-[#D9D9D9] *:flex *:items-center  *:justify-center *:gap-2.5 *:p-4 *:rounded-[10px]">
        <button>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
              fill="#FFC107"
            />
            <path
              d="M3.15308 7.3455L6.43858 9.755C7.32758 7.554 9.48058 6 12.0001 6C13.5296 6 14.9211 6.577 15.9806 7.5195L18.8091 4.691C17.0231 3.0265 14.6341 2 12.0001 2C8.15908 2 4.82808 4.1685 3.15308 7.3455Z"
              fill="#FF3D00"
            />
            <path
              d="M11.9999 22C14.5829 22 16.9299 21.0115 18.7044 19.404L15.6094 16.785C14.5717 17.5742 13.3036 18.001 11.9999 18C9.39891 18 7.19041 16.3415 6.35841 14.027L3.09741 16.5395C4.75241 19.778 8.11341 22 11.9999 22Z"
              fill="#4CAF50"
            />
            <path
              d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
              fill="#1976D2"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
        <button>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Continue with Email</span>
        </button>
      </div>
      <form action="" className="space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="bg-white outline outline-[#D9D9D9] p-4 rounded-[10px]"
          />
        </div>
        <button className="bg-black outline outline-black p-4 rounded-[10px] text-white w-full">
          Create Account
        </button>
      </form>
      <p className="text-xs text-black/50">
        Your name and photo are displayed to users who invite you to RhythmX using your email. By
        continuing, you acknowledge that you understand and agree to the Terms & Conditions and
        Privacy Policy
      </p>
    </div>
  );
}

export default Page;
