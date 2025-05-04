import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilter } from "@/components/courses/course-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Upload, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const { user } = useAuth();
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses", selectedCategory, selectedLevel, searchQuery],
  });
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will be updated by the input's onChange
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-heading">Khóa học</h1>
                <p className="text-muted-foreground mt-1">
                  Khám phá các khóa học IT với đa dạng chủ đề và cấp độ
                </p>
              </div>
              
              <form onSubmit={handleSearch} className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <CourseFilter 
                  categories={categories || []}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedLevel={selectedLevel}
                  setSelectedLevel={setSelectedLevel}
                />
                
                {user && user.role === "admin" && (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Quản lý khóa học</h3>
                    <p className="text-sm text-blue-600 mb-3">
                      Bạn có thể tải lên hoặc quản lý các khóa học với quyền admin
                    </p>
                    <div className="space-y-2">
                      <Link href="/admin?tab=courses" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Tạo khóa học mới
                        </Button>
                      </Link>
                      <Link href="/admin" className="w-full">
                        <Button variant="outline" className="w-full flex items-center justify-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Quản lý khóa học
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-80 w-full rounded-lg" />
                    ))}
                  </div>
                ) : courses?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-card">
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy khóa học nào</h3>
                    <p className="text-muted-foreground mb-6">
                      Không có khóa học nào phù hợp với tìm kiếm của bạn
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedLevel("all");
                    }}>
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
