import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: any) => void;
  isActive: boolean;
  // Thêm props mới
  preferredCamera?: 'environment' | 'user' | string; // 'environment' là camera sau
}

export const QRScanner: React.FC<QRScannerProps> = ({ 
  onScan, 
  onError, 
  isActive,
  preferredCamera = 'environment' 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [availableCameras, setAvailableCameras] = useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<number>(0);

  // Lấy danh sách camera có sẵn
  useEffect(() => {
    if (isActive) {
      QrScanner.listCameras(true).then(cameras => {
        setAvailableCameras(cameras);
        console.log('Available cameras:', cameras);
      });
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current && isActive && availableCameras.length > 0) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => onScan(result.data),
        {
          onDecodeError: (error) => {
            if (error instanceof Error && error.name !== 'NotFoundException') {
              onError(error);
            }
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: availableCameras[selectedCamera]?.id, // Dùng camera đã chọn
        }
      );
      qrScannerRef.current.start().catch(onError);
    }

    return () => {
      qrScannerRef.current?.stop();
      qrScannerRef.current?.destroy();
    };
  }, [isActive, onScan, onError, selectedCamera, availableCameras]);

  if (!isActive) return null;

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Chọn camera nếu có nhiều camera */}
      {availableCameras.length > 1 && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Camera:
          </label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableCameras.map((camera, index) => (
              <option key={index} value={index}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video hiển thị camera */}
      <video
        ref={videoRef}
        className="w-full max-w-md mx-auto rounded-lg"
        style={{ maxHeight: '300px' }}
        playsInline
        autoPlay
        muted
      />

      {/* Khung hướng dẫn */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-12">
        <div className="w-32 h-32 border-2 border-blue-500 rounded-lg"></div>
      </div>
    </div>
  );
};



