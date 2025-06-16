import React from 'react';
import { Address, Image, FormData } from './models';

interface CreateCardFormProps {
    formData: FormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddressChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Address) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Image) => void;
    onToggleIsBusiness: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({
    formData,
    onChange,
    onAddressChange,
    onImageChange,
    onToggleIsBusiness,
    onSubmit,
}) => {
    return (
        <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-10 space-y-4">
            <h2 className="text-xl font-semibold mb-4">➕ צור כרטיס חדש</h2>

            <input
                type="text"
                name="title"
                placeholder="שם הכרטיס"
                value={formData.title}
                onChange={onChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="text"
                name="phone"
                placeholder="טלפון"
                value={formData.phone}
                onChange={onChange}
                className="w-full p-2 border rounded"
                required
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(['country', 'city', 'street', 'houseNumber', 'zip'] as (keyof Address)[]).map((field) => (
                    <input
                        key={field}
                        type="text"
                        placeholder={field}
                        value={formData.address[field]}
                        onChange={(e) => onAddressChange(e, field)}
                        className="p-2 border rounded"
                        required
                    />
                ))}
            </div>

            <input
                type="text"
                name="url"
                placeholder="URL לתמונה"
                value={formData.image.url}
                onChange={(e) => onImageChange(e, 'url')}
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                name="alt"
                placeholder="תיאור תמונה"
                value={formData.image.alt}
                onChange={(e) => onImageChange(e, 'alt')}
                className="w-full p-2 border rounded"
            />

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.isBusiness}
                    onChange={onToggleIsBusiness}
                />
                <span className="text-gray-700 dark:text-white">כרטיס עסקי</span>
            </label>

            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                יצירה
            </button>
        </form>
    );
};

export default CreateCardForm;
