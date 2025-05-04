import { useState } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import UrlInput from './components/UrlInput'
import AuditResults from './components/AuditResults'
import { crawlWebsite } from './services/crawler'

interface AuditResult {
  url: string
  title: string
  metaDescription: string
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  links: {
    internal: string[]
    external: string[]
  }
  images: {
    total: number
    missingAlt: number
  }
  performance: {
    loadTime: number
    pageSize: number
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
})

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AuditResult | null>(null)
  const [error, setError] = useState('')

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true)
    setError('')
    try {
      const auditResults = await crawlWebsite(url)
      setResults(auditResults)
    } catch (err) {
      setError('Failed to analyze website. Please check the URL and try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            {error}
          </div>
        )}
        {results && <AuditResults results={results} />}
      </Container>
    </ThemeProvider>
  )
}

export default App
