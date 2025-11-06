import { AISuggestion } from "../api/aiSuggestion.api";
export const formatSuggestionToMessage = (suggestion: AISuggestion): string => {
    let message = `✅ Đã tạo gợi ý thành công!\n\n`;
    
    // Mục tiêu
    message += `🎯 Mục tiêu: ${suggestion.goal}\n\n`;
    
    // Đánh giá sức khỏe
    if (suggestion.evaluation) {
      message += `📊 Đánh giá sức khỏe:\n`;
      if (suggestion.evaluation.healthScore !== undefined) {
        message += `• Điểm số: ${suggestion.evaluation.healthScore}/100\n`;
      }
      if (suggestion.evaluation.healthStatus) {
        const statusMap: Record<string, string> = {
          'excellent': 'Xuất sắc',
          'good': 'Tốt',
          'fair': 'Trung bình',
          'poor': 'Yếu',
          'critical': 'Nghiêm trọng'
        };
        message += `• Tình trạng: ${statusMap[suggestion.evaluation.healthStatus] || suggestion.evaluation.healthStatus}\n`;
      }
      if (suggestion.evaluation.healthScoreDescription) {
        message += `• Phân tích: ${suggestion.evaluation.healthScoreDescription}\n`;
      }
      message += `\n`;
    }
    
    // Bài tập
    if (suggestion.exercises && suggestion.exercises.length > 0) {
      message += `💪 Bài tập (${suggestion.exercises.length} bài):\n`;
      suggestion.exercises.forEach((ex, idx) => {
        message += `${idx + 1}. ${ex.name}\n`;
        message += `   - Sets: ${ex.sets} | Reps: ${ex.reps} | Nghỉ: ${ex.restTime}s\n`;
        if (ex.instructions) {
          message += `   - Hướng dẫn: ${ex.instructions}\n`;
        }
      });
      message += `\n`;
    }
    
    // Thời lượng và cấp độ
    if (suggestion.workoutDuration || suggestion.difficultyLevel) {
      if (suggestion.workoutDuration) {
        message += `⏱️ Thời lượng: ${suggestion.workoutDuration} phút/buổi\n`;
      }
      if (suggestion.difficultyLevel) {
        const levelMap: Record<string, string> = {
          'Beginner': 'Mới bắt đầu',
          'Intermediate': 'Trung bình',
          'Advanced': 'Nâng cao'
        };
        message += `📈 Cấp độ: ${levelMap[suggestion.difficultyLevel] || suggestion.difficultyLevel}\n`;
      }
      message += `\n`;
    }
    
    // Gợi ý dinh dưỡng (nutrition field riêng)
    if (suggestion.nutrition) {
      message += `🥗 Gợi ý dinh dưỡng:\n${suggestion.nutrition}\n\n`;
    }
    
    // Kế hoạch dinh dưỡng (dietPlan)
    if (suggestion.dietPlan) {
      message += `🍽️ Kế hoạch dinh dưỡng:\n`;
      if (suggestion.dietPlan.dailyCalories) {
        message += `• Calo/ngày: ${suggestion.dietPlan.dailyCalories} kcal\n`;
      }
      if (suggestion.dietPlan.macros) {
        message += `• Protein: ${suggestion.dietPlan.macros.protein || 0}g\n`;
        message += `• Carbs: ${suggestion.dietPlan.macros.carbs || 0}g\n`;
        message += `• Fat: ${suggestion.dietPlan.macros.fat || 0}g\n`;
      }
      if (suggestion.dietPlan.mealTimes && suggestion.dietPlan.mealTimes.length > 0) {
        message += `\n• Lịch ăn:\n`;
        suggestion.dietPlan.mealTimes.forEach((meal, idx) => {
          message += `  ${idx + 1}. ${meal.mealName} (${meal.time}): ${meal.suggestedCalories} kcal\n`;
        });
      }
      if (suggestion.dietPlan.notes) {
        message += `\n• Ghi chú dinh dưỡng: ${suggestion.dietPlan.notes}\n`;
      }
      message += `\n`;
    }
    
    // Ghi chú chung
    if (suggestion.notes) {
      message += `📝 Ghi chú: ${suggestion.notes}\n\n`;
    }
    
    // Tin nhắn (nếu có)
    if (suggestion.message) {
      message += `💬 Tin nhắn: ${suggestion.message}\n\n`;
    }
    
    message += `Bạn có thể xem chi tiết trong phần "Lịch sử gợi ý" bên dưới.`;
    
    return message;
}