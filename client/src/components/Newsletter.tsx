import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email của bạn",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate sending data
    toast({
      title: "Đăng ký thành công!",
      description: "Cảm ơn bạn đã đăng ký nhận bản tin của chúng tôi",
    });
    
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng ký nhận thông tin mới nhất</h2>
          <p className="text-lg mb-8">
            Nhận thông báo về khóa học mới, ưu đãi đặc biệt và các tài liệu học tập miễn phí.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="px-4 py-3 rounded-md w-full md:w-2/3 text-dark focus:outline-none focus:ring-2 focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-white text-primary font-bold rounded-md hover:bg-gray-100 transition"
            >
              Đăng ký ngay
            </button>
          </form>
          <p className="text-sm mt-4 opacity-80">
            Chúng tôi sẽ không gửi spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </section>
  );
}
