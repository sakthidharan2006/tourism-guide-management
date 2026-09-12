"use client";

export default function InputField({
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center border border-slate-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-teal-600 transition">
      <div className="text-teal-700 text-xl mr-3">
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none text-slate-700"
      />
    </div>
  );
}