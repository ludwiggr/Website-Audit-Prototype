import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (including https://)');
      return;
    }
    setError('');
    onSubmit(url);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Website Audit Tool
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter a URL to analyze your website's performance and structure
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          label="Website URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!error}
          helperText={error}
          placeholder="https://example.com"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </Box>
    </Box>
  );
};

export default UrlInput; 