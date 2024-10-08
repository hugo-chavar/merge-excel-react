import { useEffect } from "react";

interface Props {
  debugMode: boolean;
  disabled: boolean;
  toggleDebugMode: () => void;
}

function DebugModeToggle({ debugMode, disabled, toggleDebugMode }: Props) {
  useEffect(() => {
    // Force re-render when debugMode changes
    if (debugMode) console.log("debugMode enabled");
    else console.log("debugMode disabled");
  }, [debugMode]);

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={debugMode}
        onChange={toggleDebugMode}
        id="debugCheck"
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor="debugCheck">
        Enable Debug Mode
      </label>
    </div>
  );
}

export default DebugModeToggle;
