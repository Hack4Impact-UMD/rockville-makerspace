import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/request-access")({
  component: RequestAccess,
});

function RequestAccess() {
  return (
    <div className="flex justify-center font-ubuntu">
      <div className="w-full max-w-150 bg-white mt-25 mb-15 p-10 rounded-xl">
        <h1 className="text-center text-[55px] font-bold text-black">
          Request Access
        </h1>

        <div className="mx-auto mt-5 mb-6 h-0.75 w-51.25 bg-black" />

        <form className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-[25px] font-medium text-gray-800">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ex. John Jones"
              required
              className="w-full rounded-md border h-13 border-gray-300 px-2 py-2 text-[18px] outline-none focus:border-teal-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-[25px] font-medium text-gray-800">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="[@rockvillesciencecenter.org]"
              required
              className="w-full rounded-md border h-13 text-[18px] border-gray-300 px-2 py-2 text-xs outline-none focus:border-teal-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-[25px] font-medium text-gray-800">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              required
              defaultValue="Staff"
              className="w-full rounded-md border h-13 text-[18px] border-gray-300 bg-white px-2 py-2"
            >
              <option value="Staff">Staff</option>
              <option value="Member">Member</option>
              <option value="Admin">Non-Member</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-[#117889] py-2 text-[25px] font-medium text-white shadow-md transition hover:bg-[#0e6573]"
          >
            Send Request
          </button>
          <button
            type="button"
            className="mt-2 w-full rounded-xl border border-[#117889] bg-white py-2 text-[25px] font-medium text-[#117889] shadow-sm transition hover:bg-gray-50"
          >
            Request Access Link
          </button>

        </form>
        <div className="mt-8 text-center">
          <a
            href="/sign-in"
            className="text-[18px] text-gray-600 underline hover:text-black"
          >
            Back to Sign In
          </a>
        </div>

      </div>
    
    </div>
  )
}
