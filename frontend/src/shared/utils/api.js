import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({ error: 'Network error. Please check your connection.' })
    } else {
      // Something else happened
      return Promise.reject({ error: error.message })
    }
  }
)
