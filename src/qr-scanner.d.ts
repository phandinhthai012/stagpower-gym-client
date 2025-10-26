declare module 'qr-scanner' {
  interface Camera {
    id: string;
    label: string;
  }

  interface ScanResult {
    data: string;
    cornerPoints: Array<{ x: number; y: number }>;
  }

  interface QrScannerOptions {
    onDecodeError?: (error: Error | string) => void;
    highlightScanRegion?: boolean;
    highlightCodeOutline?: boolean;
    preferredCamera?: string;
    maxScansPerSecond?: number;
    calculateScanRegion?: (video: HTMLVideoElement) => {
      x: number;
      y: number;
      width: number;
      height: number;
      downScaledWidth?: number;
      downScaledHeight?: number;
    };
  }

  class QrScanner {
    constructor(
      video: HTMLVideoElement,
      onDecode: (result: ScanResult) => void,
      options?: QrScannerOptions
    );

    start(): Promise<void>;
    stop(): void;
    destroy(): void;
    setCamera(cameraId: string): Promise<void>;
    hasFlash(): Promise<boolean>;
    isFlashOn(): boolean;
    toggleFlash(): Promise<void>;
    turnFlashOn(): Promise<void>;
    turnFlashOff(): Promise<void>;

    static listCameras(requestLabels?: boolean): Promise<Camera[]>;
    static hasCamera(): Promise<boolean>;
  }

  namespace QrScanner {
    export { Camera, ScanResult, QrScannerOptions };
  }

  export default QrScanner;
}

