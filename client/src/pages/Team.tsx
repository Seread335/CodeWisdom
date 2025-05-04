import { teamData } from "@/lib/data";
import TeamCard from "@/components/TeamCard";

export default function Team() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Đội Ngũ Sáng Lập & Phát Triển</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Người sáng lập trang web học tập toàn diện về công nghệ thông tin.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Người Sáng Lập</h2>
            <div className="max-w-xl mx-auto">
              {teamData.map((member, index) => (
                <TeamCard key={index} {...member} />
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Liên Hệ</h2>
            <p className="text-center mb-6">
              Nếu bạn quan tâm đến việc học tập và có thắc mắc về nội dung khóa học, hãy liên hệ với chúng tôi!
            </p>
            <div className="text-center">
              <a 
                href="/contact" 
                className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-600 transition"
              >
                Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
