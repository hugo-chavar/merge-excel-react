interface Props {
  progress: number;
  statusMessage: string;
}

const ProgressBar = ({ progress, statusMessage }: Props) => {
  return (
    <div>
      <progress value={progress} max="100" />
      <span>{Math.round(progress)}%</span>
      <span>{statusMessage}</span>
    </div>
  );
};

export default ProgressBar;
