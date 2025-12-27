import { ChangeEvent } from "react";

interface LabelledInputProps {
  input_id: string;
  label: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  placeholder: string;
}

export const LabelledInput = ({
  input_id,
  label,
  onChange,
  disabled,
  placeholder,
  type = "text",
}: LabelledInputProps) => {
  return (
    <div className="flex items-center gap-x-2 justify-center gap-y-2 w-full">
      <label className="w-20 lg:w-24 text-sm lg:text-base" htmlFor={input_id}>
        {label}
      </label>
      <input
        disabled={disabled}
        onChange={onChange}
        type={type}
        id={input_id}
        placeholder={placeholder}
        className="py-1.5 lg:py-2 px-3 lg:px-6 bg-neutral-100 outline-none focus:ring-1 focus:ring-neutral-300 rounded-md border border-neutral-300 w-[70%] lg:w-[50%]"
      />
    </div>
  );
};
