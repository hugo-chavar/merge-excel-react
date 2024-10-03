import { useState } from 'react';

function useDebugMode() {
  const [debugMode, setDebugMode] = useState(
    localStorage.getItem('debugMode') === 'true'
  );

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    localStorage.setItem('debugMode', String(!debugMode));
  };

  return { debugMode, toggleDebugMode };
};

 
export default useDebugMode;
