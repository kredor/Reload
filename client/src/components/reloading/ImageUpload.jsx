import { useState, useRef, useEffect } from 'react';

export default function ImageUpload({
    value,
    onChange,
    onDelete,
    maxSize = 5,
    disabled = false
}) {
    const [preview, setPreview] = useState(value || null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (value && value !== preview) {
            setPreview(value);
        }
    }, [value]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset error
        setError(null);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only JPG and PNG images are allowed');
            return;
        }

        // Validate file size
        const maxBytes = maxSize * 1024 * 1024;
        if (file.size > maxBytes) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Pass file to parent
        onChange(file);
    };

    const handleDelete = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onDelete?.();
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Group size preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                            onError={() => {
                                setPreview(null);
                                setError('Failed to load image');
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={disabled}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={!disabled ? handleClick : undefined}
                        className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${!disabled ? 'cursor-pointer hover:border-primary-500 hover:bg-gray-50' : 'opacity-50'} transition-colors`}
                    >
                        <div className="text-center">
                            <span className="text-3xl text-gray-400">📷</span>
                            <p className="text-xs text-gray-500 mt-1">
                                {disabled ? 'No photo' : 'Click to upload'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        capture="environment"
                        onChange={handleFileChange}
                        disabled={disabled}
                        className="hidden"
                    />

                    <p className="text-xs text-gray-500">
                        JPG or PNG, max {maxSize}MB
                    </p>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
}
