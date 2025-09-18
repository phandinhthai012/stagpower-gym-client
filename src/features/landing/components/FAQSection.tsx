import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Tôi có thể tập thử trước khi đăng ký không?",
      answer: "Có! Chúng tôi có gói tập thử 3 ngày (100,000 VNĐ) và 7 ngày (200,000 VNĐ). Bạn có thể trải nghiệm đầy đủ dịch vụ trước khi quyết định đăng ký gói dài hạn."
    },
    {
      question: "Sự khác biệt giữa gói Basic và VIP là gì?",
      answer: "Gói Basic cho phép bạn tập tại 1 chi nhánh đã đăng ký. Gói VIP cho phép bạn tập tại tất cả các chi nhánh của StagPower trên toàn TP.HCM, rất tiện lợi cho những ai thường xuyên di chuyển."
    },
    {
      question: "Tôi có thể tạm ngưng gói tập không?",
      answer: "Có, bạn có thể tạm ngưng gói tập dài hạn (≥3 tháng) tối đa 1-3 tháng. Thời gian tạm ngưng sẽ được cộng dồn vào gói của bạn. Các buổi PT còn lại sẽ được bảo lưu."
    },
    {
      question: "Có ưu đãi gì cho học sinh sinh viên không?",
      answer: "Có! Học sinh sinh viên từ 15-25 tuổi được giảm 10-15% cho tất cả gói tập. Bạn cần xuất trình thẻ HSSV hoặc CCCD để được hưởng ưu đãi này."
    },
    {
      question: "Làm thế nào để check-in tại phòng gym?",
      answer: "Bạn sẽ nhận được QR code sau khi đăng ký thành công. Chỉ cần quét QR code tại máy quét ở cửa ra vào hoặc nhờ nhân viên hỗ trợ quét bằng camera. Hệ thống sẽ tự động kiểm tra gói tập và cho phép bạn vào."
    },
    {
      question: "Tôi có thể đổi chi nhánh sau khi đăng ký không?",
      answer: "Với gói Basic, bạn có thể đổi chi nhánh bằng cách nâng cấp lên gói VIP (tính phí chênh lệch). Với gói VIP, bạn có thể tập tại bất kỳ chi nhánh nào mà không cần thông báo trước."
    },
    {
      question: "PT cá nhân có bao gồm trong gói membership không?",
      answer: "Gói membership thông thường không bao gồm PT. Tuy nhiên, chúng tôi có gói Combo kết hợp membership + PT với giá ưu đãi. Bạn cũng có thể mua thêm buổi PT riêng lẻ khi cần."
    },
    {
      question: "Tôi có thể gia hạn gói trước khi hết hạn không?",
      answer: "Có! Gia hạn trước hạn 7 ngày sẽ được giảm 5% hoặc tặng thêm ngày. Thời gian mới sẽ được cộng dồn vào gói hiện tại. Với PT, số buổi cũ sẽ được bảo lưu và cộng thêm buổi mới."
    },
    {
      question: "Phòng gym mở cửa vào những ngày nào?",
      answer: "Tất cả chi nhánh mở cửa từ 6:00 AM - 10:00 PM, 7 ngày/tuần, kể cả các ngày lễ. Chúng tôi cam kết phục vụ bạn mọi lúc để bạn có thể duy trì thói quen tập luyện."
    },
    {
      question: "Có chỗ để xe không?",
      answer: "Tất cả chi nhánh đều có bãi đỗ xe miễn phí cho hội viên. Một số chi nhánh có bãi đỗ xe máy và ô tô riêng biệt, đảm bảo an toàn cho phương tiện của bạn."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-5">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-800">
              Câu Hỏi Thường Gặp
            </h2>
          </div>
          <p className="text-xl text-gray-600">
            Tìm hiểu thêm về dịch vụ và chính sách của StagPower
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">
                  {faq.question}
                </span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Vẫn Còn Thắc Mắc?
            </h3>
            <p className="text-gray-600 mb-6">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19001234"
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                📞 Gọi 1900 1234
              </a>
              <a
                href="mailto:info@stagpower.com"
                className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center"
              >
                ✉️ Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
