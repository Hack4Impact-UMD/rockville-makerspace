interface DropdownProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  placeholder = "Select one",
}: DropdownProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <label htmlFor={id} className="text-[32px] font-[500]">
        {label}
        {required && <span className="text-warning">*</span>}
      </label>
      <div className="relative w-[720px] h-[64px]">
        <select
          id={id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-md bg-[#F0F0F0] px-[20px] py-3 text-[28px] font-[500] text-[#0B7285]"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-4 size-6 -translate-y-1/2 text-[#0B7285]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {required && <span className="text-[20px] font-[400]">Required</span>}
    </div>
  );
}
