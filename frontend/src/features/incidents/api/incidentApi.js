import { apiClient } from '../../../shared/utils/api'

/**
 * @param {import('../types').CreateIncidentRequest} data
 * @returns {Promise<{success: boolean, data: import('../types').Incident}>}
 */
export const createIncident = async (data) => {
  const response = await apiClient.post('/api/incidents', data)
  return response.data
}

/**
 * @param {import('../types').PaginationParams} params
 * @returns {Promise<{success: boolean, data: import('../types').Incident[], pagination: import('../types').PaginatedResponse['pagination']}>}
 */
export const listIncidents = async (params) => {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.severity) queryParams.append('severity', params.severity)
  if (params.status) queryParams.append('status', params.status)
  if (params.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params.order) queryParams.append('order', params.order)

  const response = await apiClient.get(`/api/incidents?${queryParams.toString()}`)
  return response.data
}

/**
 * @param {string} id
 * @returns {Promise<{success: boolean, data: import('../types').Incident}>}
 */
export const getIncidentById = async (id) => {
  const response = await apiClient.get(`/api/incidents/${id}`)
  return response.data
}

/**
 * @param {string} id
 * @param {import('../types').UpdateIncidentRequest} data
 * @returns {Promise<{success: boolean, data: import('../types').Incident}>}
 */
export const updateIncident = async (id, data) => {
  const response = await apiClient.patch(`/api/incidents/${id}`, data)
  return response.data
}
