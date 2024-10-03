import { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Update progress every 0.5 seconds
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return Math.min(prevProgress + 1, 100);
        }
        return prevProgress;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <progress value={progress} max="100" />
      <span>{Math.round(progress)}%</span>
    </div>
  );
};

export default ProgressBar;
