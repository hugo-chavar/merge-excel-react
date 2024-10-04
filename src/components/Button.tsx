interface Props {
  children: string;
  color?: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
}

const Button = ({
  children,
  color = "primary",
  onClick,
  disabled = false,
  icon,
}: Props) => {
  return (
    <button
      type="button"
      className={"btn btn-" + color}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="me-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
