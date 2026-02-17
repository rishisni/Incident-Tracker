import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material'
import { useCreateIncident } from '../hooks/useIncidents'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const createSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  service: z.string().min(1, 'Service is required').max(255, 'Service must be less than 255 characters'),
  severity: z.enum(['SEV1', 'SEV2', 'SEV3', 'SEV4']),
  status: z.enum(['OPEN', 'MITIGATED', 'RESOLVED']),
  owner: z.string().max(255, 'Owner must be less than 255 characters').nullable().optional(),
  summary: z.string().nullable().optional(),
})

export const CreateIncidentPage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateIncident()
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: '',
      service: '',
      severity: 'SEV3',
      status: 'OPEN',
      owner: '',
      summary: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        title: data.title,
        service: data.service,
        severity: data.severity,
        status: data.status,
        owner: data.owner || null,
        summary: data.summary || null,
      })
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      console.error('Failed to create incident:', err)
    }
  }

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
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Create New Incident
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Title"
                    required
                    variant="outlined"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="service"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Service"
                    required
                    variant="outlined"
                    error={!!errors.service}
                    helperText={errors.service?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.severity}>
                <InputLabel>Severity</InputLabel>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Severity">
                      <MenuItem value="SEV1">SEV1 - Critical</MenuItem>
                      <MenuItem value="SEV2">SEV2 - High</MenuItem>
                      <MenuItem value="SEV3">SEV3 - Medium</MenuItem>
                      <MenuItem value="SEV4">SEV4 - Low</MenuItem>
                    </Select>
                  )}
                />
                {errors.severity && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.severity.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.status}>
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={createMutation.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={createMutation.isLoading}
                >
                  {createMutation.isLoading ? 'Creating...' : 'Create Incident'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {showSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Incident created successfully! Redirecting...
          </Alert>
        )}

        {createMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {createMutation.error?.error || 'Failed to create incident'}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}
