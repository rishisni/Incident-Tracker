import { Routes, Route } from 'react-router-dom'
import { IncidentListPage } from './features/incidents/pages/IncidentListPage'
import { IncidentDetailPage } from './features/incidents/pages/IncidentDetailPage'
import { CreateIncidentPage } from './features/incidents/pages/CreateIncidentPage'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Incident Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<IncidentListPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/incidents/new" element={<CreateIncidentPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
