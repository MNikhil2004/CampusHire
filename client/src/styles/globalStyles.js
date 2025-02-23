import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f5f7fa;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657l7.9-7.9h2.757zm5.656 0L24.172 8.485 26.343 10.657l7.9-7.9h-.828zm5.656 0L29.828 8.485 31.242 9.9l8.485-8.485h-2.83zm5.657 0L35.485 8.485 33.314 10.657l7.9-7.9h2.757zm5.657 0L41.142 8.485 42.556 9.9l8.485-8.485h-2.83zm5.657 0L46.8 8.485 44.627 10.657l7.9-7.9h2.757zm5.657 0L52.456 8.485 53.87 9.9l8.485-8.485h-2.83zm5.657 0L58.113 8.485 59.527 9.9l8.485-8.485h-2.83zm5.657 0l-8.485 8.485 1.414 1.414 7.9-7.9h-.828zm5.657 0l-8.485 8.485 1.414 1.414 7.9-7.9h-.828zm5.657 0l-8.485 8.485 1.414 1.414 7.9-7.9h-.828zm5.657 0l-8.485 8.485 1.414 1.414 7.9-7.9h-.828z' fill='%234a90e2' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    font-family: 'Poppins', sans-serif;
  }

  /* Add smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #4A90E2;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #357ABD;
  }
`; 