import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilter } from "@/components/courses/course-filter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Database, Network, Server, Code,
  Cloud, Shield, Cpu, Briefcase
} from "lucide-react";

// Định nghĩa các kiểu dữ liệu
interface Category {
  id: number;
  name: string;
  count?: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  level: string;
  duration: string;
  enrollmentCount: number;
  price?: number;
  originalPrice?: number;
  categories: Array<{ id: number; name: string }>;
  progress?: number;
}

export default function CategoryPage() {
  const [location] = useLocation();
  const [selectedLevel, setSelectedLevel] = useState("all");
  const categoryPath = location.split("/").pop() || "";
  
  // Map URL paths to human-readable category names and icons
  const categoryMap = {
    "programming": { name: "Lập trình", icon: <Code className="h-5 w-5 mr-2" /> },
    "database": { name: "Cơ sở dữ liệu", icon: <Database className="h-5 w-5 mr-2" /> },
    "network": { name: "Mạng máy tính", icon: <Network className="h-5 w-5 mr-2" /> },
    "server": { name: "Máy chủ", icon: <Server className="h-5 w-5 mr-2" /> },
    "cloud": { name: "Điện toán đám mây", icon: <Cloud className="h-5 w-5 mr-2" /> },
    "security": { name: "An ninh mạng", icon: <Shield className="h-5 w-5 mr-2" /> },
    "ai": { name: "Trí tuệ nhân tạo", icon: <Cpu className="h-5 w-5 mr-2" /> },
    "office": { name: "Văn phòng", icon: <Briefcase className="h-5 w-5 mr-2" /> },
  };
  
  // Get category ID and name based on URL
  const categoryInfo = categoryMap[categoryPath as keyof typeof categoryMap] || { name: "Danh mục", icon: null };
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Fetch courses by category
  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses", categoryPath, selectedLevel],
    // Note: In a real implementation, we'd use the category ID from the database
    // Here we're simulating by filtering client-side based on the category path
  });
  
  // Filter courses based on category path (this would normally be done on the server)
  const filteredCourses = courses?.filter((course: Course) => {
    // This is just for demo purposes - in a real app, we'd get courses by category ID from the API
    if (!categoryPath || categoryPath === "all") return true;
    
    if (categoryPath === "programming") {
      return course.title.toLowerCase().includes("lập trình") || 
             course.title.toLowerCase().includes("python") || 
             course.title.toLowerCase().includes("java") ||
             course.title.toLowerCase().includes("javascript") ||
             course.title.toLowerCase().includes("react");
    }
    
    if (categoryPath === "database") {
      return course.title.toLowerCase().includes("cơ sở dữ liệu") || 
             course.title.toLowerCase().includes("sql") || 
             course.title.toLowerCase().includes("database");
    }
    
    if (categoryPath === "network") {
      return course.title.toLowerCase().includes("mạng") || 
             course.title.toLowerCase().includes("network");
    }
    
    if (categoryPath === "server") {
      return course.title.toLowerCase().includes("máy chủ") || 
             course.title.toLowerCase().includes("server") ||
             course.title.toLowerCase().includes("microservices");
    }
    
    if (categoryPath === "cloud") {
      return course.title.toLowerCase().includes("cloud") || 
             course.title.toLowerCase().includes("đám mây") ||
             course.title.toLowerCase().includes("aws");
    }
    
    if (categoryPath === "security") {
      return course.title.toLowerCase().includes("an ninh") || 
             course.title.toLowerCase().includes("bảo mật") ||
             course.title.toLowerCase().includes("security") ||
             course.title.toLowerCase().includes("ethical"); 
    }
    
    if (categoryPath === "ai") {
      return course.title.toLowerCase().includes("ai") || 
             course.title.toLowerCase().includes("machine learning") ||
             course.title.toLowerCase().includes("trí tuệ");
    }
    
    if (categoryPath === "office") {
      return course.title.toLowerCase().includes("văn phòng") || 
             course.title.toLowerCase().includes("office") ||
             course.title.toLowerCase().includes("excel");
    }
    
    return false;
  });
  
  // Further filter by level if selected
  const levelFilteredCourses = selectedLevel === "all" 
    ? filteredCourses 
    : filteredCourses?.filter((course: Course) => course.level === selectedLevel);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              {categoryInfo.icon}
              <h1 className="text-3xl font-bold gradient-heading">{categoryInfo.name}</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left sidebar - filters */}
              <div className="lg:col-span-1">
                {isLoadingCategories ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : (
                  <CourseFilter
                    categories={categories || []}
                    selectedCategory={categoryPath}
                    setSelectedCategory={() => {}}
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                  />
                )}
              </div>
              
              {/* Main content - course cards */}
              <div className="lg:col-span-3">
                {isLoadingCourses ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
                    ))}
                  </div>
                ) : levelFilteredCourses?.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">Không tìm thấy khóa học</h3>
                    <p className="text-muted-foreground">
                      Không có khóa học nào phù hợp với bộ lọc đã chọn.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelFilteredCourses?.map((course: Course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
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
