import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { 
  MessageSquare,
  Send,
  CheckCircle,
  Circle,
  Flame,
  TrendingUp,
  Heart,
  User,
  Calendar
} from 'lucide-react';
import { getMockDataByMemberId } from '../../../mockdata';

export function MemberSuggestions() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; role: 'assistant' | 'user'; content: string; time: string }>>(() => {
    const now = new Date();
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Xin chào! Tôi là AI Trainer Assistant của StagPower. Tôi có thể giúp bạn: \n• Tư vấn bài tập phù hợp\n• Lập kế hoạch tập luyện\n• Gợi ý dinh dưỡng\n• Theo dõi tiến độ\n\nBạn muốn tôi hỗ trợ gì hôm nay?',
        time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const listRef = useRef<HTMLDivElement | null>(null);
  const injectedLatestRef = useRef(false);

  const suggestions = useMemo(() => {
    if (!user?.id) return [] as any[];
    return getMockDataByMemberId('aiSuggestions', user.id)
      .sort((a: any, b: any) => new Date(b.recommendation_date).getTime() - new Date(a.recommendation_date).getTime());
  }, [user?.id]);

  const memberName = useMemo(() => (user as any)?.full_name || (user as any)?.fullName || 'bạn', [user]);

  const quickChips = [
    { key: 'loss', label: 'Giảm cân', icon: <Flame className="h-4 w-4" /> },
    { key: 'gain', label: 'Tăng cơ', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'health', label: 'Sức khỏe', icon: <Heart className="h-4 w-4" /> },
    { key: 'newbie', label: 'Người mới', icon: <User className="h-4 w-4" /> },
    { key: 'plan', label: 'Kế hoạch', icon: <Calendar className="h-4 w-4" /> },
    { key: 'history', label: 'Lịch sử', icon: <Calendar className="h-4 w-4" /> },
  ];

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // inject latest suggestion summary on load
  useEffect(() => {
    if (injectedLatestRef.current) return;
    if (!suggestions || suggestions.length === 0) return;
    const latest = suggestions[0] as any;
    const text = buildLatestSummary(latest);
    const t = new Date();
    setMessages((prev) => [
      ...prev,
      { id: 'latest-summary', role: 'assistant', content: text, time: t.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    injectedLatestRef.current = true;
  }, [suggestions]);

  const sendMessage = (text: string) => {
    const content = text.trim();
    if (!content) return;
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(16).slice(2), role: 'user', content, time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setQuestion('');
    // mock typing and response
    setIsTyping(true);
    setTimeout(() => {
      const reply = buildMockReply(content);
      const t = new Date();
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(16).slice(2), role: 'assistant', content: reply, time: t.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const buildMockReply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('lịch sử')) {
      if (!suggestions || suggestions.length === 0) return 'Chưa có lịch sử gợi ý.';
      const top = suggestions.slice(0, 3) as any[];
      const items = top
        .map((s: any, i: number) => `${i + 1}. ${mapGoal(s.goal)} • cấp độ ${mapLevel(s.level)} • ${formatVNDate(s.recommendation_date)} • ${s.workout_duration} phút/buổi, ${s.estimated_time} tuần`)
        .join('\n');
      return `3 gợi ý gần đây:\n${items}\nBạn muốn xem chi tiết gợi ý nào?`;
    }
    if (lower.includes('giảm cân')) {
      return 'Kế hoạch giảm cân đề xuất:\n• 3-4 buổi/tuần cardio (20–30 phút)\n• 2-3 buổi/tuần full-body strength\n• Ăn deficit ~300-500 kcal/ngày, ưu tiên protein 1.6–2g/kg\n• Ngủ 7-8h, uống đủ nước. Bạn cần lịch mẫu theo tuần không?';
    }
    if (lower.includes('tăng cơ')) {
      return 'Kế hoạch tăng cơ đề xuất:\n• 4 buổi/tuần split trên/dưới\n• Progressive overload, rep 6–12\n• Tăng nhẹ kcal (+200–300), protein 1.8–2.2g/kg\n• Theo dõi số đo mỗi 2 tuần. Muốn mình tạo giáo án 4 tuần chứ?';
    }
    if (lower.includes('sức khỏe')) {
      return 'Gợi ý nâng cao sức khỏe tổng quát:\n• 150 phút/tuần vận động vừa\n• 2 buổi/tuần bài tập sức mạnh\n• Ăn đủ rau quả, hạn chế đường đơn\n• Theo dõi giấc ngủ và stress. Mình có thể kiểm tra chỉ số gần đây của bạn để cá nhân hóa hơn.';
    }
    if (lower.includes('người mới')) {
      return 'Lộ trình cho người mới bắt đầu:\n• Tuần 1-2: học kỹ thuật, toàn thân 3 buổi/tuần\n• Tuần 3-4: tăng dần khối lượng, thêm cardio nhẹ\n• Tập trung form, không nôn nóng. Bạn có dụng cụ/khả năng đến phòng gym chứ?';
    }
    if (lower.includes('kế hoạch')) {
      return 'Mình có thể tạo kế hoạch theo mục tiêu (giảm cân/tăng cơ/sức khỏe) trong 4 tuần, có bài tập, set/rep, dinh dưỡng tham khảo. Bạn chọn mục tiêu giúp mình nhé!';
    }
    return 'Mình đã nhận câu hỏi. Bạn cho mình biết mục tiêu (giảm cân/tăng cơ/sức khỏe), tần suất tập/tuần và tình trạng hiện tại để cá nhân hóa kế hoạch nhé!';
  };

  const mapGoal = (g: string) => (g === 'WeightLoss' ? 'Giảm cân' : g === 'MuscleGain' ? 'Tăng cơ' : 'Sức khỏe');
  const mapLevel = (l: string) => (l === 'Beginner' ? 'Mới bắt đầu' : l === 'Intermediate' ? 'Trung bình' : 'Nâng cao');
  const formatVNDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN');
  const buildLatestSummary = (s: any) =>
    `Gợi ý mới nhất (${formatVNDate(s.recommendation_date)}):\n• Mục tiêu: ${mapGoal(s.goal)}\n• Cấp độ: ${mapLevel(s.level)}\n• Thời lượng: ${s.workout_duration} phút/buổi, ${s.estimated_time} tuần\nBạn có muốn xem lịch sử gợi ý không?`;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Banner header */}
      <div className="rounded-xl overflow-hidden border border-blue-200">
        <div className="bg-blue-800 text-white p-4 md:p-6">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">AI Trainer Assistant</h1>
                <p className="text-blue-100 text-sm">Chuyên gia tư vấn tập luyện</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="text-sm text-blue-100">Đang hoạt động</span>
            </div>
                  </div>
                </div>
        {/* Chat area */}
        <div className="bg-white p-0">
          <div ref={listRef} className="h-[52vh] md:h-[60vh] overflow-y-auto px-4 md:px-6 py-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm shadow border ${m.role === 'user' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-900 border-gray-200'}`}>
                  <div className="whitespace-pre-line">{m.content}</div>
                  <div className={`mt-1 text-[10px] ${m.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{m.time}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 border border-gray-200 shadow bg-white text-gray-700">
                  <Circle className="h-3 w-3 animate-pulse" />
                  <span className="text-sm">AI đang soạn...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap items-center gap-2">
        {quickChips.map((c) => (
          <Button key={c.key} variant="outline" size="sm" className="rounded-full" onClick={() => sendMessage(c.label)}>
            <span className="mr-2">{c.icon}</span>
            {c.label}
          </Button>
        ))}
                    </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-white pt-2">
        <form
          className="flex items-center gap-2 rounded-xl border p-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(question);
          }}
        >
          <Input
            placeholder="Nhập câu hỏi của bạn..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
          <Button type="submit" disabled={!question.trim() || isTyping} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
