
// Set dark mode as default for first-time visitors
if (
	!localStorage.getItem('theme') &&
	!window.matchMedia('(prefers-color-scheme: light)').matches
) {
	document.documentElement.classList.add('dark');
}

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(<App />);
