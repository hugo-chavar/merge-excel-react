interface Props {
  progress: number;
}

const ProgressBar = ({ progress }: Props) => {
  return (
    <div>
      <progress value={progress} max="100" />
      <span>{Math.round(progress)}%</span>
    </div>
  );
};

export default ProgressBar;
