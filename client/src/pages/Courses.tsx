import { useState } from "react";
import { courseData } from "@/lib/data";
import CourseCard from "@/components/CourseCard";

export default function Courses() {
  const [activeTab, setActiveTab] = useState("all-courses");
  
  const filterCourses = () => {
    if (activeTab === "all-courses") return courseData;
    return courseData.filter(course => course.category === activeTab);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Khóa Học IT Toàn Diện</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Từ nền tảng cơ bản đến chuyên sâu, lựa chọn khóa học phù hợp với mục tiêu của bạn.
          </p>
        </div>
      </div>

      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center mb-8">
            <button 
              className={`course-tab ${activeTab === "all-courses" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("all-courses")}
            >
              Tất cả
            </button>
            <button 
              className={`course-tab ${activeTab === "beginner-courses" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("beginner-courses")}
            >
              Cơ bản
            </button>
            <button 
              className={`course-tab ${activeTab === "web-courses" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("web-courses")}
            >
              Web Development
            </button>
            <button 
              className={`course-tab ${activeTab === "ai-courses" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("ai-courses")}
            >
              AI & ML
            </button>
            <button 
              className={`course-tab ${activeTab === "more-courses" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("more-courses")}
            >
              Xem thêm
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCourses().map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
