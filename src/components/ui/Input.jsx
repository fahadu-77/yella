export default function Input({
    label,
    error,
    className = '',
    type = 'text',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
