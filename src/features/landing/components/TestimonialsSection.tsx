import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';
import { ratingApi, Testimonial } from '../api/rating.api';

export const TestimonialsSection: React.FC = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRatings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ratingApi.getTopRatings(6);
        setTestimonials(data);
      } catch (err: any) {
        console.error('Error fetching top ratings:', err);
        setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
        // Fallback to empty array or keep previous data
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatings();
  }, []);

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Hội Viên Nói Gì Về StagPower?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Hơn 5,000 hội viên đã tin tưởng và đồng hành cùng chúng tôi trong hành trình fitness
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Đang tải đánh giá...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-red-500 mb-4 px-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-orange-600 hover:text-orange-700 underline text-sm sm:text-base"
            >
              Thử lại
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-600">Chưa có đánh giá nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* User Info */}
              <div className="text-center mb-3 sm:mb-4">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
              </div>

              {/* Package & Branch Info */}
              <div className="text-center text-xs sm:text-sm text-gray-500 border-t pt-3 sm:pt-4">
                <p className="font-medium text-orange-600 mb-1">{testimonial.package}</p>
                <p className="mb-1">Chi nhánh: {testimonial.branch}</p>
                <p>PT: <span className="font-medium">{testimonial.trainerName}</span></p>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-10 sm:mt-12 lg:mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2">
              Bạn Cũng Muốn Trở Thành Một Trong Những Câu Chuyện Thành Công?
            </h3>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90 px-2">
              Hãy bắt đầu hành trình fitness của bạn ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 transition-all hover:-translate-y-1 w-full sm:w-auto"
              >
                Đăng Ký Ngay
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-white hover:text-orange-600 transition-all hover:-translate-y-1 w-full sm:w-auto"
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
