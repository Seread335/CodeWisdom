import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { LessonContent } from "@/components/lessons/lesson-content";
import { 
  ArrowLeft, ArrowRight, Menu, X, 
  CheckCircle2, Circle, BookOpen
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ["/api/lessons", id],
  });
  
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["/api/courses", lesson?.courseId],
    enabled: !!lesson?.courseId,
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/lessons/${id}/complete`,
        {}
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses", lesson?.courseId] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses/recommended"] });
      toast({
        title: "Hoàn thành bài học",
        description: "Bài học đã được đánh dấu là hoàn thành",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = lessonLoading || (lesson?.courseId && courseLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Skeleton className="h-4 w-24 mr-2" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-64 ml-2" />
              </div>
              <Skeleton className="h-8 w-96 mb-6" />
              <Skeleton className="h-64 w-full rounded-lg mb-8" />
              <Skeleton className="h-32 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Bài học không tồn tại</h2>
              <p className="text-muted-foreground mb-6">Bài học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
              <Button asChild>
                <Link href="/courses">Quay lại danh sách khóa học</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Course content sidebar */}
          <div 
            className={`bg-card border-r w-80 flex-shrink-0 overflow-y-auto transition-all duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'
            }`}
          >
            {course && (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b sticky top-0 bg-card z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate mr-2">{course.title}</h3>
                    {isMobile && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSidebarOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {course.completedLessons}/{course.totalLessons} bài học hoàn thành
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full mt-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="mb-6">
                      <div className="font-medium mb-2 text-sm">
                        {moduleIndex + 1}. {module.title}
                      </div>
                      <div className="space-y-1 pl-6">
                        {module.lessons.map((lessonItem) => {
                          const isActive = lessonItem.id === parseInt(id);
                          const isCompleted = lessonItem.completed;
                          
                          return (
                            <Link 
                              key={lessonItem.id} 
                              href={`/lessons/${lessonItem.id}`}
                            >
                              <div 
                                className={`flex items-center p-2 rounded-md text-sm ${
                                  isActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-muted'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="truncate">{lessonItem.title}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Main lesson content */}
          <main className="flex-1 overflow-y-auto relative">
            {/* Toggle sidebar button (mobile only) */}
            {isMobile && !sidebarOpen && (
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-4 left-4 z-20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Link href={`/courses/${lesson.courseId}`} className="hover:text-primary hover:underline">
                  {course?.title}
                </Link>
                <svg className="h-3 w-3 mx-2" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l6 6-6 6" />
                </svg>
                <span>Bài {lesson.order}</span>
              </div>
              
              <h1 className="text-2xl font-bold mb-6">
                {lesson.title}
              </h1>
              
              <div className="mb-8">
                {lesson.videoUrl && (
                  <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={lesson.videoUrl}
                      title={lesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <LessonContent content={lesson.content} />
              </div>
              
              <div className="border-t pt-6 flex justify-between">
                {lesson.prevLessonId ? (
                  <Button variant="outline" asChild>
                    <Link href={`/lessons/${lesson.prevLessonId}`}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Bài trước
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href={`/courses/${lesson.courseId}`}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại khóa học
                    </Link>
                  </Button>
                )}
                
                <div className="flex gap-2">
                  {!lesson.completed && (
                    <Button 
                      variant="secondary"
                      onClick={() => markCompleteMutation.mutate()}
                      disabled={markCompleteMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {markCompleteMutation.isPending ? "Đang xử lý..." : "Đánh dấu hoàn thành"}
                    </Button>
                  )}
                  
                  {lesson.nextLessonId ? (
                    <Button asChild>
                      <Link href={`/lessons/${lesson.nextLessonId}`}>
                        Bài tiếp theo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href={`/courses/${lesson.courseId}`}>
                        Hoàn thành
                        <CheckCircle2 className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
