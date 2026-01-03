export default function AutocompleteInput({
    label,
    name,
    options = [],
    required = false,
    error,
    register,
    placeholder
}) {
    const listId = `${name}-datalist`;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type="text"
                list={listId}
                {...register(name, required ? { required: `${label} is required` } : {})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={placeholder}
                autoComplete="off"
            />
            <datalist id={listId}>
                {options.map((option, index) => (
                    <option key={index} value={option} />
                ))}
            </datalist>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
        </div>
    );
}
