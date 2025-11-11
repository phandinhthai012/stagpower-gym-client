import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface ModelQRMomoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    qrData: any;
}
// setQrData({
//     qrCodeUrl: res.momoPayment.qrCodeUrl || res.momoPayment.payUrl,
//     paymentId: res.momoPayment.orderId,
//     deepLink: res.momoPayment.deepLink,
//     amount: res.momoPayment.amount,
//     invoiceId: res.momoPayment.requestId,
//   });

const ModelQRMomo = ({ isOpen, onClose, onSuccess, qrData }: ModelQRMomoProps) => {
    if (!isOpen || !qrData) return null;

    const handleClose = () => {
        onClose();
        onSuccess?.();
    };

    const formattedAmount = qrData.amount
        ? new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(Number(qrData.amount))
        : undefined;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <CardHeader className="sticky top-0 bg-white border-b z-10">
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                        QR Code Momo
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {qrData.qrCodeUrl ? (
                            <img src={qrData.qrCodeUrl} alt="QR Code Momo" width={220} height={220} />
                        ) : (
                            <p className="text-sm text-red-500">Không tìm thấy QR Code</p>
                        )}
                        {formattedAmount && (
                            <p className="text-sm text-gray-700 font-medium">Số tiền: {formattedAmount}</p>
                        )}
                        {qrData.invoiceId && (
                            <p className="text-xs text-gray-500">Mã hóa đơn: {qrData.invoiceId}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-center">
                        {qrData.deepLink ? (
                            <a href={qrData.deepLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
                                <Button variant="outline" className="w-full">Mở MoMo</Button>
                            </a>
                        ) : (
                            <p className="text-xs text-gray-500 text-center">Vui lòng quét QR bằng ứng dụng MoMo.</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="sticky bottom-0 bg-white border-t z-10">
                    <Button variant="outline" className="w-full" onClick={handleClose}>Đóng</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ModelQRMomo;