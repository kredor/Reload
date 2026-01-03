import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchPresets = async (type) => {
    const response = await axios.get(`${API_URL}/loads/presets/${type}`);
    return response.data;
};

export function useCaliberPresets() {
    return useQuery({
        queryKey: ['presets', 'calibers'],
        queryFn: () => fetchPresets('calibers'),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useBulletBrandPresets() {
    return useQuery({
        queryKey: ['presets', 'bullet-brands'],
        queryFn: () => fetchPresets('bullet-brands'),
        staleTime: 10 * 60 * 1000,
    });
}

export function usePowderManufacturerPresets() {
    return useQuery({
        queryKey: ['presets', 'powder-manufacturers'],
        queryFn: () => fetchPresets('powder-manufacturers'),
        staleTime: 10 * 60 * 1000,
    });
}

export function usePowderTypePresets(manufacturer) {
    return useQuery({
        queryKey: ['presets', 'powder-types', manufacturer],
        queryFn: () => fetchPresets(`powder-types${manufacturer ? `?manufacturer=${manufacturer}` : ''}`),
        staleTime: 10 * 60 * 1000,
        enabled: !!manufacturer, // Only fetch if manufacturer is provided
    });
}
