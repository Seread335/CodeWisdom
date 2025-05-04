import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-graduation-cap mr-2"></i>
              <span>IT Academy</span>
            </div>
            <p className="text-gray-300 mb-6">
              Nền tảng học tập IT toàn diện dành cho mọi đối tượng, từ người mới bắt đầu đến chuyên gia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Khóa học</h3>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition">Lập trình Web</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition">Python & Data Science</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition">AI & Machine Learning</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition">DevOps & Cloud</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition">Cybersecurity</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Câu hỏi thường gặp</a></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition">Liên hệ hỗ trợ</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Tài nguyên</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Blog công nghệ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Tài liệu miễn phí</a></li>
              <li><Link href="/roadmap" className="text-gray-300 hover:text-white transition">Lộ trình học tập</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Cơ hội nghề nghiệp</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Chứng chỉ quốc tế</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} IT Academy. Đã đăng ký bản quyền.</p>
          <p className="mt-2">Thiết kế và phát triển bởi <span className="text-white font-semibold">Huỳnh Thái Bảo</span></p>
        </div>
      </div>
    </footer>
  );
}
