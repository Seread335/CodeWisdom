import { Link } from "wouter";

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Học IT Hiệu Quả & Toàn Diện</h1>
            <p className="text-lg md:text-xl mb-8">
              Lộ trình học tập được cá nhân hóa từ cơ bản đến chuyên sâu, 
              giúp bạn chinh phục mục tiêu nghề nghiệp trong lĩnh vực công nghệ.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/roadmap" 
                className="bg-white text-primary font-bold px-6 py-3 rounded-md text-center hover:bg-gray-100 transition"
              >
                Xem Lộ Trình
              </Link>
              <Link 
                href="/courses" 
                className="bg-accent text-white font-bold px-6 py-3 rounded-md text-center hover:bg-green-600 transition"
              >
                Khám Phá Khóa Học
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Học viên IT" 
              className="rounded-lg shadow-xl max-w-full h-auto" 
              width="500" 
              height="375"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
          <path fill="#f8fafc" fillOpacity="1" d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,128C672,128,768,96,864,85.3C960,75,1056,85,1152,96C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
