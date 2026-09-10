function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  optionValue = "id",
  optionLabel = "name",
  error,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-4 py-2 transition outline-none ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        }`}
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option[optionValue]} value={option[optionValue]}>
            {option[optionLabel]}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default SelectField;
