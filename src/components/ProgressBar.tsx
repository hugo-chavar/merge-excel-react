interface Props {
  progress: number;
  statusMessage: string;
  success: boolean;
  error: boolean;
}

const ProgressBar = ({ progress, statusMessage, success, error }: Props) => {
  const mode = error ? "danger" : success ? "success" : "info";

  return (
    <div className="bd-example m-0 border-0">
      <div
        className="progress"
        role="progressbar"
        aria-label="Cases progress"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: "20px" }}
      >
        <div
          className={"progress-bar text-bg-" + mode}
          style={{ width: Math.round(progress) + "%" }}
        >
          {Math.round(progress)}%
        </div>
      </div>
      <span>{statusMessage}</span>
    </div>
  );
};

export default ProgressBar;
