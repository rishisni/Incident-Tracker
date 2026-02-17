import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material'
import { useIncident, useUpdateIncident } from '../hooks/useIncidents'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['OPEN', 'MITIGATED', 'RESOLVED']),
  owner: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
})

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'SEV1':
      return 'error'
    case 'SEV2':
      return 'warning'
    case 'SEV3':
      return 'info'
    case 'SEV4':
      return 'success'
    default:
      return 'default'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'OPEN':
      return 'error'
    case 'MITIGATED':
      return 'warning'
    case 'RESOLVED':
      return 'success'
    default:
      return 'default'
  }
}

export const IncidentDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useIncident(id)
  const updateMutation = useUpdateIncident(id)

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      status: data?.data?.status || 'OPEN',
      owner: data?.data?.owner || '',
      summary: data?.data?.summary || '',
    },
    values: data?.data
      ? {
          status: data.data.status,
          owner: data.data.owner || '',
          summary: data.data.summary || '',
        }
      : undefined,
  })

  const onSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({
        owner: formData.owner || null,
        summary: formData.summary || null,
        status: formData.status,
      })
    } catch (err) {
      console.error('Failed to update incident:', err)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.error || 'Failed to load incident'}
      </Alert>
    )
  }

  if (!data?.data) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Incident not found
      </Alert>
    )
  }

  const incident = data.data

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Incident Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={incident.severity}
              color={getSeverityColor(incident.severity)}
              size="medium"
            />
            <Chip
              label={incident.status}
              color={getStatusColor(incident.status)}
              size="medium"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={incident.title}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Service"
                value={incident.service}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Status">
                      <MenuItem value="OPEN">Open</MenuItem>
                      <MenuItem value="MITIGATED">Mitigated</MenuItem>
                      <MenuItem value="RESOLVED">Resolved</MenuItem>
                    </Select>
                  )}
                />
                {errors.status && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.status.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="owner"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Owner"
                    variant="outlined"
                    error={!!errors.owner}
                    helperText={errors.owner?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Summary"
                    multiline
                    rows={4}
                    variant="outlined"
                    error={!!errors.summary}
                    helperText={errors.summary?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Created At"
                value={new Date(incident.createdAt).toLocaleString()}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Updated At"
                value={new Date(incident.updatedAt).toLocaleString()}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={!isDirty || updateMutation.isLoading}
                >
                  {updateMutation.isLoading ? <CircularProgress size={20} /> : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {updateMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {updateMutation.error?.error || 'Failed to update incident'}
          </Alert>
        )}

        {updateMutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Incident updated successfully!
          </Alert>
        )}
      </Paper>
    </Box>
  )
}
