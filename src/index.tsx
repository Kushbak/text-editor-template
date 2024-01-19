import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TextEditorProvider } from './components/TextEditor/context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TextEditorProvider>
      <App />
    </TextEditorProvider>
  </React.StrictMode>
);