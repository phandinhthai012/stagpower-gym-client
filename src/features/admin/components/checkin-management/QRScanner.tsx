// Import các thư viện cần thiết
import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner'; // Thư viện để quét QR code từ camera

// Định nghĩa interface cho props của component QRScanner
interface QRScannerProps {
    onScan: (result: string) => void;    // Callback function được gọi khi quét thành công QR code
    onError: (error: any) => void;       // Callback function được gọi khi có lỗi xảy ra
    isActive: boolean;                   // Boolean để bật/tắt scanner
}

// Component chính để quét QR code bằng camera
export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError, isActive }) => {
    // useRef để lưu reference đến video element (hiển thị camera stream)
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // useRef để lưu reference đến instance của QrScanner (để quản lý lifecycle)
    const qrScannerRef = useRef<QrScanner | null>(null);

    // useEffect để khởi tạo và quản lý QrScanner
    useEffect(() => {
        // Chỉ khởi tạo khi có video element và isActive = true
        if (videoRef.current && isActive) {
            // Tạo instance mới của QrScanner
            qrScannerRef.current = new QrScanner(
                videoRef.current,                    // Video element để hiển thị camera
                (result) => onScan(result.data),    // Callback khi quét thành công QR code
                {
                    // Xử lý lỗi khi decode QR code
                    onDecodeError: (error) => {
                        // Kiểm tra kiểu dữ liệu để tránh lỗi TypeScript
                        if (error instanceof Error && error.name !== 'NotFoundException') {
                            // NotFoundException là lỗi bình thường khi không tìm thấy QR code
                            // Chỉ báo lỗi cho các lỗi khác
                            onError(error);
                        } else if (typeof error === 'string') {
                            // Nếu error là string, chuyển đổi thành Error object
                            const errorObj = new Error(error);
                            onError(errorObj);
                        }
                    },
                    highlightScanRegion: true,       // Highlight vùng quét QR code
                    highlightCodeOutline: true,      // Highlight đường viền QR code
                }
            );
            // Bắt đầu quét QR code
            qrScannerRef.current.start();
        }

        // Cleanup function - chạy khi component unmount hoặc dependencies thay đổi
        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();     // Dừng camera stream
                qrScannerRef.current.destroy();  // Giải phóng resources
            }
        };
    }, [isActive, onScan, onError]); // Dependencies: re-run khi các giá trị này thay đổi

    // Conditional rendering - không render gì nếu isActive = false
    if (!isActive) return null;

    // JSX return - giao diện của component
    return (
        <div className="relative"> {/* Container với position relative để overlay elements */}
            {/* Video element để hiển thị camera stream */}
            <video
                ref={videoRef}                                    // Gắn reference để QrScanner có thể control
                className="w-full max-w-md mx-auto rounded-lg"  // Styling: responsive, rounded corners
                style={{ maxHeight: '300px' }}                   // Giới hạn chiều cao tối đa
            />
            
            {/* Overlay element - khung hướng dẫn để đưa QR code vào */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Khung hình vuông màu xanh để guide user */}
                <div className="w-32 h-32 border-2 border-blue-500 rounded-lg bg-transparent"></div>
            </div>
        </div>
    );
};