import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface AuditResultsProps {
  results: {
    url: string;
    title: string;
    metaDescription: string;
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
    };
    links: {
      internal: string[];
      external: string[];
    };
    images: {
      total: number;
      missingAlt: number;
    };
    performance: {
      loadTime: number;
      pageSize: number;
    };
    accessibility: {
      hasLang: boolean;
      hasSkipLink: boolean;
      hasAriaLabels: number;
      hasAriaRoles: number;
      hasFormLabels: number;
      hasTableHeaders: number;
      hasLandmarks: number;
      colorContrast: boolean;
      hasKeyboardNavigation: boolean;
    };
  };
}

const AuditResults: React.FC<AuditResultsProps> = ({ results }) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const AccessibilityItem = ({ label, value, isBoolean = false }: { label: string; value: boolean | number; isBoolean?: boolean }) => (
    <ListItem>
      <ListItemIcon>
        {isBoolean ? (
          value ? <CheckIcon color="success" /> : <CancelIcon color="error" />
        ) : (
          <InfoIcon color="info" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={label}
        secondary={isBoolean ? (value ? 'Yes' : 'No') : `${value} found`}
      />
    </ListItem>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Audit Results
      </Typography>
      
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Typography>URL: {results.url}</Typography>
            <Typography>Title: {results.title}</Typography>
            <Typography>Meta Description: {results.metaDescription}</Typography>
          </Paper>
        </Grid>

        {/* Accessibility Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Accessibility Analysis
            </Typography>
            <List>
              <AccessibilityItem label="Language Attribute" value={results.accessibility.hasLang} isBoolean />
              <AccessibilityItem label="Skip Link" value={results.accessibility.hasSkipLink} isBoolean />
              <AccessibilityItem label="ARIA Labels" value={results.accessibility.hasAriaLabels} />
              <AccessibilityItem label="ARIA Roles" value={results.accessibility.hasAriaRoles} />
              <AccessibilityItem label="Form Labels" value={results.accessibility.hasFormLabels} />
              <AccessibilityItem label="Table Headers" value={results.accessibility.hasTableHeaders} />
              <AccessibilityItem label="Landmark Roles" value={results.accessibility.hasLandmarks} />
              <AccessibilityItem label="Color Contrast" value={results.accessibility.colorContrast} isBoolean />
              <AccessibilityItem label="Keyboard Navigation" value={results.accessibility.hasKeyboardNavigation} isBoolean />
            </List>
          </Paper>
        </Grid>

        {/* Headings Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Headings Structure
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="H1 Tags"
                  secondary={`${results.headings.h1.length} found`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="H2 Tags"
                  secondary={`${results.headings.h2.length} found`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="H3 Tags"
                  secondary={`${results.headings.h3.length} found`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Links Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Links Analysis
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Internal Links"
                  secondary={`${results.links.internal.length} found`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="External Links"
                  secondary={`${results.links.external.length} found`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Images Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Images Analysis
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Total Images"
                  secondary={results.images.total}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Images Missing Alt Text"
                  secondary={results.images.missingAlt}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Load Time"
                  secondary={`${results.performance.loadTime.toFixed(2)}ms`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Page Size"
                  secondary={formatBytes(results.performance.pageSize)}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditResults; 