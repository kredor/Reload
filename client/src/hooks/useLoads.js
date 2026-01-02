import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadsAPI } from '../services/api';

/**
 * Hook to fetch all loads with filters
 */
export function useLoads(filters = {}) {
  return useQuery({
    queryKey: ['loads', filters],
    queryFn: () => loadsAPI.getAll(filters),
  });
}

/**
 * Hook to fetch a single load
 */
export function useLoad(id) {
  return useQuery({
    queryKey: ['load', id],
    queryFn: () => loadsAPI.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new load
 */
export function useCreateLoad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => loadsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
    },
  });
}

/**
 * Hook to update an existing load
 */
export function useUpdateLoad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => loadsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
    },
  });
}

/**
 * Hook to delete a load
 */
export function useDeleteLoad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => loadsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
    },
  });
}

/**
 * Hook to get filter options
 */
export function useFilterOptions() {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => loadsAPI.getFilters(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
