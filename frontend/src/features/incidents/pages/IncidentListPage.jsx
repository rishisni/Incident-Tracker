import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Add as AddIcon } from '@mui/icons-material'
import { useIncidents } from '../hooks/useIncidents'
import { useDebounce } from '../../../shared/hooks/useDebounce'

const severityOptions = [
  { value: '', label: 'All' },
  { value: 'SEV1', label: 'SEV1' },
  { value: 'SEV2', label: 'SEV2' },
  { value: 'SEV3', label: 'SEV3' },
  { value: 'SEV4', label: 'SEV4' },
]

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'MITIGATED', label: 'Mitigated' },
  { value: 'RESOLVED', label: 'Resolved' },
]

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'SEV1':
      return '#d32f2f'
    case 'SEV2':
      return '#f57c00'
    case 'SEV3':
      return '#fbc02d'
    case 'SEV4':
      return '#388e3c'
    default:
      return '#666'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'OPEN':
      return '#d32f2f'
    case 'MITIGATED':
      return '#f57c00'
    case 'RESOLVED':
      return '#388e3c'
    default:
      return '#666'
  }
}

export const IncidentListPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortModel, setSortModel] = useState([{ field: 'createdAt', sort: 'desc' }])

  const debouncedSearch = useDebounce(search, 500)

  const queryParams = useMemo(
    () => ({
      page: page + 1,
      limit: pageSize,
      search: debouncedSearch || undefined,
      severity: severityFilter || undefined,
      status: statusFilter || undefined,
      sortBy: sortModel[0]?.field || 'createdAt',
      order: sortModel[0]?.sort?.toUpperCase() || 'DESC',
    }),
    [page, pageSize, debouncedSearch, severityFilter, statusFilter, sortModel]
  )

  const { data, isLoading, error } = useIncidents(queryParams)

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'service',
      headerName: 'Service',
      width: 180,
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color: getSeverityColor(params.value),
            fontWeight: 'bold',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{
            color: getStatusColor(params.value),
            fontWeight: 'bold',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 150,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return ''
        return new Date(params.value).toLocaleString()
      },
    },
  ]

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.error || 'Failed to load incidents'}
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Incidents
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/incidents/new')}
        >
          Create Incident
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by title, service, or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                {severityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            paginationMode="server"
            rowCount={data?.pagination?.total || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize)
              setPage(0)
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRowClick={(params) => navigate(`/incidents/${params.row.id}`)}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
            loading={isLoading}
          />
        )}
      </Paper>
    </Box>
  )
}
