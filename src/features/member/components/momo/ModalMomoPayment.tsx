import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { QrCode, Smartphone, Clock, CheckCircle } from 'lucide-react';
import momoLogo from '../../../../assets/momo-logo.png';
import QRCode from 'qrcode';
interface ModalMomoPaymentProps {
    open: boolean;
    qrCodeUrl: string;
    deeplink: string;
    amount: number;
    paymentId: string;
    onCancel: () => void;
    onSuccess: () => void;
}

export function ModalMomoPayment({
    open, qrCodeUrl, deeplink, amount, paymentId, onCancel, onSuccess
}: ModalMomoPaymentProps) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 phút
    const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    useEffect(() => {
        if (!open || status !== 'pending') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setStatus('failed');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open, status]);

    useEffect(() => {
        if (!qrCodeUrl) return;
        QRCode.toDataURL(qrCodeUrl)
            .then(setQrCodeDataUrl)
            .catch(console.error);
    }, [qrCodeUrl]);
    
    useEffect(() => {
        if (!open) return;

        // Giả sử bạn có socket connection
        const handlePaymentUpdate = (data: any) => {
            if (data._id === paymentId && data.paymentStatus === 'Completed') {
                console.log('data', data);
                setStatus('success');
                setTimeout(() => onSuccess(), 2000);
            }
        };

        // socket.on('payment_completed', handlePaymentUpdate);

        return () => {
            // socket.off('payment_completed', handlePaymentUpdate);
        };
    }, [open, paymentId]);
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] bg-white overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <img src={momoLogo} alt="MoMo" className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="text-base sm:text-lg">Thanh toán qua MoMo</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {status === 'pending' && (
                        <>
                            {/* QR Code */}
                            <div className="flex flex-col items-center">
                                <div className="p-2 sm:p-4 bg-white border-2 border-gray-200 rounded-xl">
                                    {qrCodeUrl ? (
                                        <img 
                                            src={qrCodeDataUrl || ''} 
                                            alt="QR Code" 
                                            className="w-48 h-48 sm:w-64 sm:h-64 max-w-full h-auto" 
                                        />
                                    ) : (
                                        <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center bg-gray-100">
                                            <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 text-center px-2">
                                    Quét mã QR để thanh toán
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg text-center">
                                <p className="text-xs sm:text-sm text-gray-600">Số tiền thanh toán</p>
                                <p className="text-lg sm:text-2xl font-bold text-blue-600 break-all">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(amount)}
                                </p>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Thời gian còn lại: {formatTime(timeLeft)}</span>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-2">
                                <p className="font-medium text-sm">Hướng dẫn thanh toán:</p>
                                <ol className="text-xs sm:text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                    <li>Mở ứng dụng MoMo</li>
                                    <li>Chọn &quot;Quét mã QR&quot;</li>
                                    <li>Quét mã QR trên màn hình</li>
                                    <li>Xác nhận và hoàn tất thanh toán</li>
                                </ol>
                            </div>

                            {/* Deeplink button */}
                            <Button
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                                onClick={() => window.open(deeplink, '_blank')}
                            >
                                <Smartphone className="w-4 h-4 mr-2" />
                                <span className="text-sm sm:text-base">Mở ứng dụng MoMo</span>
                            </Button>

                            <Button variant="outline" className="w-full" onClick={onCancel}>
                                <span className="text-sm sm:text-base">Hủy thanh toán</span>
                            </Button>
                        </>
                    )}

                    {status === 'success' && (
                        <div className="text-center py-6 sm:py-8">
                            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">Thanh toán thành công!</h3>
                            <p className="text-sm sm:text-base text-gray-600">Đang chuyển hướng...</p>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div className="text-center py-6 sm:py-8">
                            <p className="text-sm sm:text-base text-red-600 mb-4">Hết thời gian thanh toán</p>
                            <Button onClick={onCancel} className="text-sm sm:text-base">Đóng</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}