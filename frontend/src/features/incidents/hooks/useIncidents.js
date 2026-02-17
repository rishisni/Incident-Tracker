import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncident,
} from '../api/incidentApi'

/**
 * @param {import('../types').PaginationParams} params
 */
export const useIncidents = (params) => {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => listIncidents(params),
    keepPreviousData: true,
  })
}

/**
 * @param {string} id
 */
export const useIncident = (id) => {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => getIncidentById(id),
    enabled: !!id,
  })
}

export const useCreateIncident = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}

/**
 * @param {string} id
 */
export const useUpdateIncident = (id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incidents', id] })
    },
  })
}
