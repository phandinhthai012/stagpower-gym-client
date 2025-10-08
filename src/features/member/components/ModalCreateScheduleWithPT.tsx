import React, { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { mockUsers, mockBranches } from '../../../mockdata';
import { X } from 'lucide-react';

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onSuccess?: (payload: any) => void;
};

export default function ModalCreateScheduleWithPT({ trigger, open, onOpenChange, onSuccess }: Props) {
  const trainers = useMemo(() => mockUsers.filter((u) => u.role === 'Trainer'), []);
  const [trainerId, setTrainerId] = useState<string>('');
  const [branchId, setBranchId] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('90');
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = trainerId && branchId && dateTime && Number(duration) > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess?.({
        trainer_id: trainerId,
        branch_id: branchId,
        date_time: new Date(dateTime).toISOString(),
        duration_minutes: Number(duration),
        note: note || 'Buổi PT cá nhân',
      });
      onOpenChange?.(false);
    }, 700);
  };

  return (
    <div>
      {trigger && <div onClick={() => onOpenChange?.(true)}>{trigger}</div>}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-[2px]">
          <Card className="relative w-full max-w-xl bg-white">
            {/* Close button */}
            <button
              aria-label="Đóng"
              className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
              onClick={() => {
                if (confirm('Bạn có chắc muốn hủy đặt lịch?')) onOpenChange?.(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>
            <CardHeader>
              <CardTitle>Đặt lịch PT mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Huấn luyện viên</Label>
                <Select value={trainerId} onValueChange={setTrainerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn PT" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chi nhánh</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBranches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thời gian</Label>
                  <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Thời lượng (phút)</Label>
                  <Input type="number" min={30} step={15} value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: tập ngực - tay" />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Xác nhận hủy đặt lịch?')) onOpenChange?.(false);
                  }}
                >
                  Hủy
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
                  {submitting ? 'Đang tạo...' : 'Tạo lịch'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


