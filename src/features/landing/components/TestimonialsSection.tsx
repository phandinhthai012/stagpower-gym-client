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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Đang tải đánh giá...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-orange-600 hover:text-orange-700 underline"
            >
              Thử lại
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có đánh giá nào.</p>
          </div>
        ) : (
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
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>

              {/* Package & Branch Info */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p className="font-medium text-orange-600">{testimonial.package}</p>
                <p>Chi nhánh: {testimonial.branch}</p>
                <p className="mt-1">PT: <span className="font-medium">{testimonial.trainerName}</span></p>
              </div>
            </div>
          ))}
          </div>
        )}

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
