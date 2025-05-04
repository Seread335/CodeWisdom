import { teamData, extendedTeamData } from "@/lib/data";
import TeamCard from "@/components/TeamCard";

export default function Team() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Đội Ngũ Sáng Lập & Giảng Viên</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Những chuyên gia giàu kinh nghiệm sẽ đồng hành cùng bạn trong hành trình học tập.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">Đội Ngũ Lãnh Đạo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamData.map((member, index) => (
                <TeamCard key={index} {...member} />
              ))}
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Giảng Viên Chuyên Ngành</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {extendedTeamData.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-center text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Tham Gia Đội Ngũ</h2>
            <p className="text-center mb-6">
              Chúng tôi luôn tìm kiếm những người tài năng đam mê giảng dạy và chia sẻ kiến thức.
              Nếu bạn quan tâm đến việc trở thành một phần của đội ngũ IT Academy, hãy liên hệ với chúng tôi!
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
