import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { LearningPath } from "@/components/courses/learning-path";
import { CourseCard } from "@/components/courses/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses/recommended"],
  });

  const { data: paths, isLoading: pathsLoading } = useQuery({
    queryKey: ["/api/learning-paths"],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-heading">
                  Chào {user?.displayName || user?.username}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Hãy tiếp tục hành trình học tập của bạn
                </p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  className="pl-8 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-1 lg:col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Tiến độ học tập</h2>
                    <Button variant="link" asChild>
                      <Link href="/courses/in-progress">Xem tất cả</Link>
                    </Button>
                  </div>
                  
                  {!coursesLoading && courses?.inProgress?.length > 0 ? (
                    <div className="space-y-4">
                      {courses.inProgress.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{course.title}</h3>
                            <div className="w-full bg-muted h-2 rounded-full mt-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>{course.progress}% hoàn thành</span>
                              <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                            </div>
                          </div>
                          <Button variant="secondary" size="sm" asChild className="ml-4">
                            <Link href={`/lessons/${course.currentLessonId}`}>Tiếp tục</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : coursesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <Skeleton className="h-5 w-2/3 mb-2" />
                            <Skeleton className="h-2 w-full mb-2" />
                            <div className="flex justify-between">
                              <Skeleton className="h-3 w-16" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-9 w-24 ml-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Bạn chưa bắt đầu học khóa học nào</p>
                      <Button asChild>
                        <Link href="/courses">Khám phá khóa học</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tổng thời gian học</p>
                      <p className="text-2xl font-semibold">{user?.stats?.totalLearningTime || "0"} giờ</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Khóa học đã hoàn thành</p>
                      <p className="text-2xl font-semibold">{user?.stats?.completedCourses || 0}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bài học đã hoàn thành</p>
                      <p className="text-2xl font-semibold">{user?.stats?.completedLessons || 0}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Chứng chỉ đã nhận</p>
                      <p className="text-2xl font-semibold">{user?.stats?.certificates || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Lộ trình học tập</h2>
                <Button variant="link" asChild>
                  <Link href="/learning-paths">Xem tất cả</Link>
                </Button>
              </div>
              
              {!pathsLoading && paths?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paths.slice(0, 3).map((path) => (
                    <LearningPath key={path.id} path={path} />
                  ))}
                </div>
              ) : pathsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Không có lộ trình học tập nào</p>
                </Card>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Khóa học đề xuất</h2>
                <Button variant="link" asChild>
                  <Link href="/courses">Xem tất cả</Link>
                </Button>
              </div>

              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="beginner">Cơ bản</TabsTrigger>
                  <TabsTrigger value="intermediate">Trung cấp</TabsTrigger>
                  <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  {!coursesLoading && courses?.recommended?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {courses.recommended.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : coursesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-80 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Không có khóa học nào</p>
                    </Card>
                  )}
                </TabsContent>
                
                {["beginner", "intermediate", "advanced"].map((level) => (
                  <TabsContent key={level} value={level} className="mt-4">
                    {!coursesLoading && courses?.recommended?.filter(c => c.level === level)?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.recommended
                          .filter(course => course.level === level)
                          .map((course) => (
                            <CourseCard key={course.id} course={course} />
                          ))}
                      </div>
                    ) : coursesLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-80 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <p className="text-muted-foreground">Không có khóa học {level === 'beginner' ? 'cơ bản' : level === 'intermediate' ? 'trung cấp' : 'nâng cao'} nào</p>
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
