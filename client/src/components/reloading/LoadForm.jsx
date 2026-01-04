import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from '../common/AutocompleteInput';
import ImageUpload from './ImageUpload';
import {
    useCaliberPresets,
    useBulletBrandPresets,
    usePowderManufacturerPresets,
    usePowderTypePresets
} from '../../hooks/usePresets';

export default function LoadForm({ initialData, onSubmit, isSubmitting }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: initialData || {},
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [deleteExistingPhoto, setDeleteExistingPhoto] = useState(false);

    // Watch powder manufacturer for dependent dropdown
    const powderManufacturer = useWatch({
        control,
        name: 'powder_manufacturer',
    });

    // Fetch presets
    const { data: caliberPresets = [] } = useCaliberPresets();
    const { data: bulletBrandPresets = [] } = useBulletBrandPresets();
    const { data: powderManufacturerPresets = [] } = usePowderManufacturerPresets();
    const { data: powderTypePresets = [] } = usePowderTypePresets(powderManufacturer);

    const onFormSubmit = async (data) => {
        const formData = new FormData();

        // Add all form fields
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        });

        // Add photo if selected
        if (photoFile) {
            formData.append('groupPhoto', photoFile);
        } else if (deleteExistingPhoto) {
            formData.append('deletePhoto', 'true');
        }

        // Call parent onSubmit with FormData
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Weapon & Caliber Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Weapon & Caliber</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AutocompleteInput
                        label="Caliber"
                        name="caliber"
                        options={caliberPresets}
                        required
                        error={errors.caliber}
                        register={register}
                        placeholder=".308 Winchester"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Weapon
                        </label>
                        <input
                            type="text"
                            {...register('test_weapon')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Tikka T3"
                        />
                    </div>
                </div>
            </div>

            {/* Bullet Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Bullet</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AutocompleteInput
                        label="Manufacturer"
                        name="bullet_manufacturer"
                        options={bulletBrandPresets}
                        register={register}
                        placeholder="Sierra"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <input
                            type="text"
                            {...register('bullet_type')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="HPBT MatchKing"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (grains)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('bullet_weight_grains', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="168"
                        />
                    </div>
                </div>
            </div>

            {/* Powder Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Powder</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AutocompleteInput
                        label="Manufacturer"
                        name="powder_manufacturer"
                        options={powderManufacturerPresets}
                        register={register}
                        placeholder="Vihtavuori"
                    />
                    <AutocompleteInput
                        label="Type"
                        name="powder_type"
                        options={powderTypePresets}
                        register={register}
                        placeholder="N140"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Charge Weight (grains)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('charge_weight_grains', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="42.5"
                        />
                    </div>
                </div>
            </div>

            {/* Primer Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Primer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Manufacturer
                        </label>
                        <input
                            type="text"
                            {...register('primer_manufacturer')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="CCI"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <input
                            type="text"
                            {...register('primer_type')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="BR2"
                        />
                    </div>
                </div>
            </div>

            {/* Cartridge Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Cartridge</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Case Manufacturer
                        </label>
                        <input
                            type="text"
                            {...register('case_manufacturer')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Lapua"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Length (mm)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('total_cartridge_length_mm', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="70.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Free Travel (mm)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('free_travel_mm', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="0.5"
                        />
                    </div>
                </div>
            </div>

            {/* Loading Info Section - NEW */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Loading Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loading Date
                        </label>
                        <input
                            type="date"
                            {...register('loading_date')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity Loaded
                        </label>
                        <input
                            type="number"
                            {...register('cartridges_loaded', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Number
                        </label>
                        <input
                            type="text"
                            {...register('batch_number')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="2024-01"
                        />
                    </div>
                </div>
            </div>

            {/* Performance Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Velocity (m/s)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('velocity_ms', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="790"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Group Size (mm)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('group_size_mm', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="25"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Distance (m)
                        </label>
                        <input
                            type="number"
                            {...register('distance_meters', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="100"
                        />
                    </div>
                </div>

                {/* Test Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Date
                    </label>
                    <input
                        type="date"
                        {...register('tested_date')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Group Photo Section - NEW */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Group Size Photo</h2>
                <ImageUpload
                    value={initialData?.group_photo_path && !deleteExistingPhoto
                        ? initialData.group_photo_path
                        : null
                    }
                    onChange={(file) => {
                        setPhotoFile(file);
                        setDeleteExistingPhoto(false);
                    }}
                    onDelete={() => {
                        setPhotoFile(null);
                        setDeleteExistingPhoto(true);
                    }}
                    disabled={isSubmitting}
                />
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Notes</h2>
                <textarea
                    {...register('notes')}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Additional notes about this load..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                >
                    {isSubmitting ? 'Saving...' : 'Save Load'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="py-3 px-6 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
