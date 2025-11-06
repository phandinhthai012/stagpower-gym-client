import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import {
  MessageSquare,
  Send,
  Circle,
  Flame,
  TrendingUp,
  Heart,
  User,
  Calendar,
  Activity,
  Dumbbell,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { useAISuggestions, useCreateAISuggestion } from '../hooks/useAISuggestions';
import { formatSuggestionToMessage } from '../utils/aiSuggestion.utils';
import { SuggestionDetailDialog } from '../components/SuggestionDetailDialog';
export function MemberSuggestions() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedAISuggestionsCount, setDisplayedAISuggestionsCount] = useState(5);
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
  const { data: suggestionData, isLoading: isLoadingSuggestions, refetch: refetchSuggestions } = useAISuggestions(user?.id);
  const {
    chatWithAI,
    isChatWithAILoading,
    createAISuggestionCompletion,
    isCreateAISuggestionCompletionLoading,
    generateWorkoutSuggestion,
    isGenerateWorkoutSuggestionLoading,
    generateNutritionSuggestion,
    isGenerateNutritionSuggestionLoading,
  } = useCreateAISuggestion();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [openSuggestionDetailDialog, setOpenSuggestionDetailDialog] = useState(false);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const quickChips = useMemo(() => [
    {
      key: 'complete',
      label: 'Tạo gợi ý toàn diện',
      icon: <Sparkles className="h-4 w-4" />,
      onClick: async () => {
        if (!user?.id) return;
        const now = new Date();
        const currentQuestion = question?.trim() || '';
        const messageText = currentQuestion || 'Tạo gợi ý toàn diện';
        const userMessage = {
          id: Math.random().toString(16).slice(2),
          role: 'user' as const,
          content: currentQuestion ? `Tạo gợi ý toàn diện: ${currentQuestion}` : 'Tạo gợi ý toàn diện',
          time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setQuestion('');
        setIsTyping(true);
        try {
          const response = await createAISuggestionCompletion({
            memberId: user.id,
            message: messageText?.trim() || 'Tạo gợi ý toàn diện'
          });
          await refetchSuggestions();
          const assistantMessage = {
            id: Math.random().toString(16).slice(2),
            role: 'assistant' as const,
            content: formatSuggestionToMessage(response),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, assistantMessage]);

        } catch (error) {
          const errorMessage = {
            id: Math.random().toString(16).slice(2),
            role: 'assistant' as const,
            content: `Đã có lỗi xảy ra: ${error.message || 'Vui lòng thử lại sau.'}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
          console.error('Error creating AI suggestion completion:', error);
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsTyping(false);

        }
      },
      loading: isCreateAISuggestionCompletionLoading
    },
    {
      key: 'workout',
      label: 'Tạo gợi ý luyện tập',
      icon: <Dumbbell className="h-4 w-4" />,
      onClick: async () => {
        if (!user?.id) return;
        const now = new Date();
        const currentQuestion = question?.trim() || '';
        const messageText = currentQuestion || 'Tạo gợi ý toàn diện';
        const userMessage = {
          id: Math.random().toString(16).slice(2),
          role: 'user' as const,
          content: currentQuestion ? `Tạo gợi ý toàn diện: ${currentQuestion}` : 'Tạo gợi ý toàn diện',
          time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setQuestion('');
        setIsTyping(true);
        try {
          const response = await generateWorkoutSuggestion({
            memberId: user.id,
            message: messageText?.trim() || 'Tạo gợi ý luyện tập'
          });
          const assistantMessage = {
            id: Math.random().toString(16).slice(2),
            role: 'assistant' as const,
            content: formatSuggestionToMessage(response),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
          const errorMessage = {
            id: Math.random().toString(16).slice(2),
            role: 'assistant' as const,
            content: `Đã có lỗi xảy ra: ${error.message || 'Vui lòng thử lại sau.'}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, errorMessage]);
          console.error('Error generating workout suggestion:', error);
        } finally {
          setIsTyping(false);
        }
      },
      loading: isGenerateWorkoutSuggestionLoading
    },
    {
      key: 'nutrition',
      label: 'Tạo gợi ý dinh dưỡng',
      icon: <UtensilsCrossed className="h-4 w-4" />,
      onClick: async () => {
        if (!user?.id) return;
        const now = new Date();
        const currentQuestion = question?.trim() || '';
        const messageText = currentQuestion || 'Tạo gợi ý dinh dưỡng';
        const userMessage = {
          id: Math.random().toString(16).slice(2),
          role: 'user' as const,
          content: currentQuestion ? `Tạo gợi ý dinh dưỡng: ${currentQuestion}` : 'Tạo gợi ý dinh dưỡng',
          time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setQuestion('');
        setIsTyping(true);


        try {
          const response = await generateNutritionSuggestion({
            memberId: user.id,
            message: messageText?.trim() || 'Tạo gợi ý dinh dưỡng'
          });
          const assistantMessage = {
            id: Math.random().toString(16).slice(2),
            role: 'assistant' as const,
            content: formatSuggestionToMessage(response),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
          const errorMessage = {
            id: Math.random().toString(16).slice(2),
            role: 'assistant' as const,
            content: `Đã có lỗi xảy ra: ${error.message || 'Vui lòng thử lại sau.'}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, errorMessage]);
          console.error('Error generating nutrition suggestion:', error);
        } finally {
          setIsTyping(false);
        }
      },
      loading: isGenerateNutritionSuggestionLoading
    },
  ], [
    question,
    user?.id,
    createAISuggestionCompletion,
    generateWorkoutSuggestion,
    generateNutritionSuggestion,
    refetchSuggestions,
    isCreateAISuggestionCompletionLoading,
    isGenerateWorkoutSuggestionLoading,
    isGenerateNutritionSuggestionLoading
  ]);

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

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || !user?.id) return;
    const now = new Date();
    const userMessage = {
      id: Math.random().toString(16).slice(2),
      role: 'user' as const,
      content,
      time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    // Thêm tin nhắn user vào messages
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsTyping(true);
    try {
      const conversationHistory = messages
        .filter(m => m.id !== 'welcome') // Bỏ welcome message
        .map(m => ({
          role: m.role,
          content: m.content
        }));
      const response = await chatWithAI({
        memberId: user.id,
        message: content,
        conversationHistory: conversationHistory.length > 0 ? conversationHistory : undefined
      });
      console.log('response', response);
      const assistantMessage = {
        id: Math.random().toString(16).slice(2),
        role: 'assistant' as const,
        content: response.answer + '\n' + response.suggestedActions?.join('\n') + '\n' + response.safetyWarning,
        time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    } catch (error) {
      const errorMessage = {
        id: Math.random().toString(16).slice(2),
        role: 'assistant' as const,
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [user?.id, messages]);

  const buildMockReply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('lịch sử')) {
      if (!suggestionData || suggestionData.length === 0) return 'Chưa có lịch sử gợi ý.';
      const top = suggestionData.slice(0, 3);
      const items = top
        .map((s, i) => `${i + 1}. ${s.goal} • ${formatVNDate(s.recommendationDate)} • ${s.workoutDuration || 'N/A'} phút/buổi`)
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

  const formatVNDate = useCallback((iso: string) => {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const handleOpenSuggestionDetailDialog = useCallback((suggestionId: string) => {
    if (!suggestionId) return;
    setSelectedSuggestionId(suggestionId);
    setOpenSuggestionDetailDialog(true);
  }, []);

  const handleCloseSuggestionDetailDialog = useCallback(() => {
    setSelectedSuggestionId(null);
    setOpenSuggestionDetailDialog(false);
  }, []);

  const handleLoadMoreSuggestions = useCallback(() => {
    setDisplayedAISuggestionsCount((prev) => prev + 5);
  }, []);

  const handleUnloadSuggestions = useCallback(() => {
    setDisplayedAISuggestionsCount(5);
  }, []);
  const RecentSuggestions = useMemo(() => {
    if (!suggestionData) return undefined;
    return suggestionData
      .sort((a, b) => new Date(b.recommendationDate).getTime() - new Date(a.recommendationDate).getTime())
      .slice(0, displayedAISuggestionsCount);
  }, [suggestionData, displayedAISuggestionsCount]);
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
          <Button
            key={c.key}
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={c.onClick}
            disabled={c.loading || isCreateAISuggestionCompletionLoading || isGenerateWorkoutSuggestionLoading || isGenerateNutritionSuggestionLoading}
          >
            <span className="mr-2">{c.icon}</span>
            {c.loading || isCreateAISuggestionCompletionLoading || isGenerateWorkoutSuggestionLoading || isGenerateNutritionSuggestionLoading ? 'Đang tạo...' : c.label}
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
      {/* History suggestions */}
      <div className="p-4 md:p-6 space-y-6">
        {/* History suggestions */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Lịch sử gợi ý</h2>

          {isLoadingSuggestions ? (
            <div className="text-center text-gray-500 py-4">Đang tải...</div>
          ) : suggestionData && suggestionData.length > 0 ? (
            <>
              <div className="space-y-3">
                {RecentSuggestions.map((suggestion) => {
                  return (
                    <Card key={suggestion._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{suggestion.status}</Badge>
                              {suggestion.evaluation?.healthScore !== undefined && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  Điểm: {suggestion.evaluation.healthScore}/100
                                </Badge>
                              )}
                            </div>

                            <h3 className="font-semibold text-lg">{suggestion.goal}</h3>

                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatVNDate(suggestion.recommendationDate)}</span>
                              </div>
                              {suggestion.workoutDuration && (
                                <div className="flex items-center gap-1">
                                  <Activity className="h-4 w-4" />
                                  <span>{suggestion.workoutDuration} phút</span>
                                </div>
                              )}
                              {suggestion.exercises && suggestion.exercises.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Dumbbell className="h-4 w-4" />
                                  <span>{suggestion.exercises.length} bài tập</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleOpenSuggestionDetailDialog(suggestion._id);
                            }}
                            disabled={isLoadingSuggestions}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {/* Chỉ hiển thị nút khi có dữ liệu và có nhiều hơn số lượng hiển thị ban đầu */}
              {suggestionData && suggestionData.length > 5 && (
                <div className="flex justify-end">
                  {displayedAISuggestionsCount < suggestionData.length ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleLoadMoreSuggestions}>
                        Xem thêm
                      </Button>
                      {displayedAISuggestionsCount > 5 && (
                        <Button variant="outline" size="sm" onClick={handleUnloadSuggestions} className='ml-2'>
                          Thu gọn
                        </Button>
                      )}
                    </>
                  ) : displayedAISuggestionsCount > 5 ? (
                    <Button variant="outline" size="sm" onClick={handleUnloadSuggestions}>
                      Thu gọn
                    </Button>
                  ) : null}
                </div>
              )}

            </>
          ) : (
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center text-gray-500">
                <p>Chưa có lịch sử gợi ý nào.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <SuggestionDetailDialog
        open={openSuggestionDetailDialog}
        onClose={handleCloseSuggestionDetailDialog}
        AISuggestionID={selectedSuggestionId}
      />
    </div>

  );
}
