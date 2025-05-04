# Website Audit Tool

A React-based web application that allows users to analyze and audit their websites. The tool provides insights into various aspects of a website's structure and performance.

## Features

- URL validation and input
- Basic website analysis including:
  - Page title and meta description
  - Heading structure (H1, H2, H3)
  - Internal and external links
  - Image analysis (total count and missing alt tags)
  - Performance metrics (load time and page size)

## Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd website-audit-prototype
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a valid URL (including https://) in the input field
2. Click "Analyze" to start the website audit
3. View the results in the organized sections below:
   - Basic Information
   - Headings Structure
   - Links Analysis
   - Images Analysis
   - Performance Metrics

## Technical Details

The application is built using:
- React with TypeScript
- Vite for build tooling
- Material-UI for the user interface
- Modern web APIs for website analysis

## Limitations

- The tool can only analyze publicly accessible websites
- CORS policies may prevent analysis of some websites
- Performance metrics are measured client-side and may vary based on network conditions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
