type UpdateDebugModeCallback = (debugMode: boolean) => void;

interface LoggerProps {
  updateDebugMode: (callback: UpdateDebugModeCallback) => void;
}

class Logger {
  private debugMode: boolean = false;
  private updateDebugMode: (callback: UpdateDebugModeCallback) => void;

  constructor({ updateDebugMode }: LoggerProps) {
    this.updateDebugMode = updateDebugMode;
    this.updateDebugMode((debugMode) => {
      this.debugMode = debugMode;
    });
  }

  log(...args: any[]): void {
    if (this.debugMode) {
      console.log("LOGGER", ...args);
    }
  }

  update(): void {
    this.updateDebugMode((debugMode) => {
      this.debugMode = debugMode;
    });
  }
}

export default Logger;