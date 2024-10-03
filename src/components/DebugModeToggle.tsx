import { useEffect } from "react";

interface Props {
  debugMode: boolean;
  toggleDebugMode: () => void;
}

function DebugModeToggle({ debugMode, toggleDebugMode }: Props) {
  useEffect(() => {
    // Force re-render when debugMode changes
    if (debugMode) console.log("debugMode enabled");
    else console.log("debugMode disabled");
  }, [debugMode]);

  return (
    <label>
      <input type="checkbox" checked={debugMode} onChange={toggleDebugMode} />
      Enable Debug Mode
    </label>
  );
}

export default DebugModeToggle;
