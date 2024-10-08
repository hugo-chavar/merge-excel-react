import { useEffect } from "react";

interface Props {
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
  name: string;
  children: string;
}

function DebugModeToggle({
  children,
  checked,
  disabled,
  onChange,
  name,
}: Props) {
  useEffect(() => {
    // Force re-render when debugMode changes
    if (checked) console.log(`${name} enabled`);
    else console.log(`${name} disabled`);
  }, [checked]);

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={`${name}Check`}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={`${name}Check`}>
        {children}
      </label>
    </div>
  );
}

export default DebugModeToggle;
