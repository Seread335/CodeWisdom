import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import { teamData, courseData, featuresData, roadmapData } from "@/lib/data";
import TeamCard from "@/components/TeamCard";
import CourseCard from "@/components/CourseCard";
import RoadmapCard from "@/components/RoadmapCard";
import FeatureCard from "@/components/FeatureCard";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Introduction Section */}
      <Introduction />

      {/* Team Section */}
      <section id="team" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội Ngũ Sáng Lập & Giảng Viên</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Những chuyên gia giàu kinh nghiệm sẽ đồng hành cùng bạn trong hành trình học tập.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamData.map((member, index) => (
              <TeamCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="roadmap" className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lộ Trình Học Tập</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Lựa chọn lộ trình phù hợp với mục tiêu nghề nghiệp của bạn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapData.map((roadmap, index) => (
              <RoadmapCard key={index} {...roadmap} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="/roadmap"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-600 transition"
            >
              Xem tất cả lộ trình
            </a>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khóa Học IT Toàn Diện</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Từ nền tảng cơ bản đến chuyên sâu, lựa chọn khóa học phù hợp với mục tiêu của bạn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.slice(0, 6).map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="/courses"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-600 transition"
            >
              Xem tất cả khóa học
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại Sao Chọn IT Academy?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nền tảng học tập toàn diện với nhiều tính năng ưu việt.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
