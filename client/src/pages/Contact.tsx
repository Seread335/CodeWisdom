import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Có câu hỏi? Hãy liên hệ với chúng tôi qua các kênh sau.
          </p>
        </div>
      </div>

      <section id="contact" className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactForm />
            
            <div className="flex flex-col justify-between">
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Địa chỉ</h4>
                      <p className="text-gray-600">123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Email</h4>
                      <p className="text-gray-600">info@itacademy.vn</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Hotline</h4>
                      <p className="text-gray-600">+84 (28) 3456 7890</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-6">Kết nối với chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a href="#" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition">
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
                  <a href="#" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition">
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a href="#" className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition">
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                  <a href="#" className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
