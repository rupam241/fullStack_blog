import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {

    // Apply the theme class directly to the body element
    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.className = theme; // Set theme to body
    
    }
  }, [theme]);

  return (
    <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
      {children}
    </div>
  );
}
