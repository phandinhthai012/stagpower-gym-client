import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const navigate = useNavigate();
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      role: "Hội viên VIP",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "StagPower đã thay đổi hoàn toàn cuộc sống của tôi. Từ một người ít vận động, giờ tôi đã có thể chạy 5km mỗi ngày. Huấn luyện viên rất chuyên nghiệp và tận tâm.",
      package: "Gói VIP 12 tháng",
      branch: "Quận 1"
    },
    {
      id: 2,
      name: "Trần Văn Hùng",
      role: "Hội viên Basic",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Cơ sở vật chất hiện đại, không gian sạch sẽ. Nhân viên hỗ trợ nhiệt tình. Tôi đã giảm được 8kg trong 3 tháng đầu tiên. Rất hài lòng với dịch vụ!",
      package: "Gói Basic 3 tháng",
      branch: "Quận 3"
    },
    {
      id: 3,
      name: "Lê Thị Mai",
      role: "Hội viên Combo",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Gói Combo với PT thực sự hiệu quả. PT của tôi rất am hiểu và tạo ra chương trình tập phù hợp với mục tiêu của tôi. Đã tăng cơ và giảm mỡ đáng kể.",
      package: "Gói Combo 6 tháng + 10 PT",
      branch: "Quận 7"
    },
    {
      id: 4,
      name: "Phạm Đức Thành",
      role: "Hội viên HSSV",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Là sinh viên, tôi rất hài lòng với ưu đãi HSSV. Giá cả hợp lý, chất lượng dịch vụ tuyệt vời. Đã tập được 6 tháng và cảm thấy sức khỏe cải thiện rõ rệt.",
      package: "Gói Basic 6 tháng (HSSV)",
      branch: "Gò Vấp"
    },
    {
      id: 5,
      name: "Hoàng Thị Lan",
      role: "Hội viên VIP",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Tính năng VIP cho phép tôi tập ở nhiều chi nhánh rất tiện lợi. Dù đi công tác hay du lịch, tôi vẫn có thể duy trì thói quen tập luyện. Rất đáng đồng tiền!",
      package: "Gói VIP 12 tháng",
      branch: "Tất cả chi nhánh"
    },
    {
      id: 6,
      name: "Võ Minh Tuấn",
      role: "Hội viên PT",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "PT cá nhân tại StagPower thực sự chuyên nghiệp. Họ không chỉ hướng dẫn tập luyện mà còn tư vấn dinh dưỡng. Tôi đã đạt được mục tiêu tăng cơ như mong muốn.",
      package: "20 buổi PT cá nhân",
      branch: "Quận 1"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Hội Viên Nói Gì Về StagPower?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 5,000 hội viên đã tin tưởng và đồng hành cùng chúng tôi trong hành trình fitness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* User Info */}
              <div className="flex items-center justify-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              {/* Package & Branch Info */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p className="font-medium text-orange-600">{testimonial.package}</p>
                <p>Chi nhánh: {testimonial.branch}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Bạn Cũng Muốn Trở Thành Một Trong Những Câu Chuyện Thành Công?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Hãy bắt đầu hành trình fitness của bạn ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:-translate-y-1"
              >
                Đăng Ký Ngay
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all hover:-translate-y-1"
              >
                Đăng Nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
