import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { QrCode } from 'lucide-react';

interface MemberPaymentModalProps {
  open: boolean;
  onClose: () => void;
  method?: 'momo' | 'zalopay' | 'bank';
  packageName: string;
  amount: number;
  getConfig: (method: 'momo' | 'zalopay' | 'bank' | undefined) => { title: string; steps: string[] };
}

const MemberPaymentModal: React.FC<MemberPaymentModalProps> = ({ open, onClose, method, packageName, amount, getConfig }) => {
  if (!open) return null;
  const cfg = getConfig(method);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-[2px]">
      <Card className="relative w-full max-w-lg bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-900">{cfg.title}</h3>
            <button className="text-gray-500 hover:text-red-600" onClick={onClose}>✕</button>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 w-48 h-48 bg-gray-50 border-2 border-dashed rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-gray-500" />
            </div>
            <p className="text-sm text-gray-600">Quét mã QR để thanh toán</p>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Gói tập:</span>
              <span className="font-medium text-blue-900">{packageName}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600">Thành tiền:</span>
              <span className="font-bold text-blue-900">{new Intl.NumberFormat('vi-VN').format(amount)} VNĐ</span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn thanh toán</h4>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              {cfg.steps.map((s) => (<li key={s}>{s}</li>))}
            </ol>
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Hủy</Button>
            <Button className="flex-1" onClick={onClose}>Đã thanh toán</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberPaymentModal;


