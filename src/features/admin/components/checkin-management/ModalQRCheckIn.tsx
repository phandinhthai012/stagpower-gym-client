import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { CheckCircle, XCircle, AlertTriangle, Camera, QrCode } from 'lucide-react';

import { useAdminCheckIn } from '../../hooks/useAdminCheckIn';
import { useBranches } from '../../hooks/useBranches';
import { QRScanner } from './QRScanner';
interface ModalQRCheckInProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ModalQRCheckIn: React.FC<ModalQRCheckInProps> = ({ isOpen, onClose }) => {
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [qrToken, setQrToken] = useState('');
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
    const [validationMessage, setValidationMessage] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    // const [isProcessing, setIsProcessing] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const { data: branchesData } = useBranches();
    const { adminQRCheckIn, isCheckingInQR } = useAdminCheckIn();
    const branches = branchesData || [];

    // hàm bất camera
    const handleQRScan = async () => {
        if (!selectedBranchId) {
            setCheckInStatus('error');
            setValidationMessage('Vui lòng chọn chi nhánh trước khi quét QR');
            return;
        }

        setIsScanning(true); // <-- Chỉ cần bật chế độ quét
        setCheckInStatus('idle');
        setValidationMessage('');
        setQrToken(''); // Xóa token cũ
        setCameraError(null);

        // Simulate QR scanning - in real implementation, you would use a QR scanner library
        // const token = prompt('Nhập token từ QR code (hoặc scan QR code):');

        // if (token) {
        //     setQrToken(token);
        //     await processQRCheckIn(token);
        // }

        // setIsScanning(false);
    };

    const handleError = useCallback((error: any) => {
        console.error('QR Scanner Error:', error);
        setCameraError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
        setIsScanning(false);
    }, []);
    // const handleScan = async (result: string) => {
    //     setQrToken(result);
    //     setIsScanning(false);
    //     await processQRCheckIn(result);
    // };
    const processQRCheckIn = async (token: string) => {
        if (!token || !selectedBranchId) return;
        setCheckInStatus('idle');
        setValidationMessage('Đã quét. Đang xử lý mã QR code...');

        try {
            await adminQRCheckIn({
                token: token,
                branchId: selectedBranchId
            });

            setCheckInStatus('success');
            setValidationMessage('Check-in bằng QR code thành công!');
            setIsScanning(false); // <-- CHỈ TẮT CAMERA KHI THÀNH CÔNG


            // Reset form after 2 seconds
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error: any) {
            setCheckInStatus('error');
            setValidationMessage(error?.response?.data?.message || 'Lỗi: Mã không hợp lệ. Vui lòng quét lại.');
            setQrToken(''); // Xóa token lỗi để sẵn sàng quét lại
        }
    };


    const handleManualTokenInput = () => {
        const token = prompt('Nhập token QR code thủ công:');
        if (token) {
            setQrToken(token);
            processQRCheckIn(token);
        }
    };

    const handleClose = () => {
        setSelectedBranchId('');
        setQrToken('');
        setCheckInStatus('idle');
        setValidationMessage('');
        setIsScanning(false);
        // setIsProcessing(false);
        setCameraError(null);
        onClose();
    };

    const getValidationMessageColor = () => {
        switch (checkInStatus) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Check-in bằng QR Code
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Branch Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="branch">Chọn Chi Nhánh *</Label>
                        <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn chi nhánh..." />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.filter(branch => branch.status === 'Active').map((branch) => (
                                    <SelectItem key={branch._id} value={branch._id}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{branch.name}</span>
                                            <span className="text-sm text-gray-500">{branch.address}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* QR Scanner Section */}
                    <div className="space-y-4">
                        <Label>Quét QR Code</Label>

                        {/* Scanner Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            {/* DÙNG LOGIC ĐỂ HIỂN THỊ CAMERA HOẶC ICON */}
                            {isScanning ? (
                                // 3a. KHI ĐANG QUÉT: HIỂN THỊ CAMERA
                                <div className="space-y-4">
                                    <QRScanner
                                        isActive={isScanning}
                                        onScan={(result:string) => {
                                            // Chỉ xử lý nếu:
                                            // 1. Không đang trong quá trình gọi API (!isCheckingInQR)
                                            // 2. Token vừa quét khác token cũ (tránh spam)
                                            if (!isCheckingInQR && result !== qrToken) {
                                                setQrToken(result); // Lưu token
                                                processQRCheckIn(result); // Gửi đi xử lý
                                            }
                                        }}
                                        onError={handleError}
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Đang quét QR code...
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Đưa QR code vào khung hình để quét
                                        </p>
                                    </div>
                                </div>
                            ) :
                                (
                                    // 3b. KHI CHƯA QUÉT: HIỂN THỊ ICON TĨNH
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <QrCode className="w-8 h-8 text-blue-600" />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {qrToken ? 'Đã quét xong' : 'Sẵn sàng quét QR code'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {qrToken
                                                    ? 'Đang xử lý token...'
                                                    : 'Nhấn nút "Quét QR Code" bên dưới để bắt đầu'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            {/* Hiển thị token SAU KHI quét xong */}
                            {qrToken && (
                                <div className="bg-gray-50 rounded-lg p-3 text-left mt-4">
                                    <p className="text-sm text-gray-600">Token đã quét:</p>
                                    <p className="font-mono text-sm break-all">{qrToken}</p>
                                </div>
                            )}
                            {/* Camera Error */}
                            {cameraError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-800">{cameraError}</span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleQRScan}
                                disabled={!selectedBranchId || isScanning || isCheckingInQR}
                                className="flex items-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                {isScanning ? 'Đang quét...' : 'Quét QR Code'}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleManualTokenInput}
                                disabled={!selectedBranchId || isCheckingInQR}
                                className="flex items-center gap-2"
                            >
                                <QrCode className="w-4 h-4" />
                                Nhập Token Thủ công
                            </Button>
                        </div>
                    </div>

                    {/* Validation Message */}
                    {validationMessage && (
                        <div className={`p-2 rounded-lg border ${getValidationMessageColor()}`}>
                            <div className="flex items-center gap-2">
                                {checkInStatus === 'success' && <CheckCircle className="w-4 h-4" />}
                                {checkInStatus === 'error' && <XCircle className="w-4 h-4" />}
                                {checkInStatus === 'warning' && <AlertTriangle className="w-4 h-4" />}
                                <span className="text-sm font-medium">{validationMessage}</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-1 pt-2">
                        <Button variant="outline" onClick={handleClose} className="flex-1">
                            Đóng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};







{/* <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <QrCode className="w-8 h-8 text-blue-600" />
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {isScanning ? 'Đang quét QR code...' : 'Sẵn sàng quét QR code'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {isScanning 
                                            ? 'Vui lòng đưa QR code vào khung hình' 
                                            : 'Nhấn nút bên dưới để bắt đầu quét QR code'
                                        }
                                    </p>
                                </div>

                                {/* QR Token Display *
                                qrToken && 
                                    <div className="bg-gray-50 rounded-lg p-3 text-left">
                                        <p className="text-sm text-gray-600">Token đã quét:</p>
                                        <p className="font-mono text-sm break-all">{qrToken}</p>
                                    </div>
                                
                            </div> */}