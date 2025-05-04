import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Users, BookOpen, Award, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ["/api/courses", id],
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/enrollments`, { courseId: parseInt(id) });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses/recommended"] });
      toast({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký khóa học thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                  <Link href="/courses">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Link>
                </Button>
                <Skeleton className="h-8 w-64" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-32 w-full" />
                </div>
                
                <div className="space-y-6">
                  <Skeleton className="h-80 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Khóa học không tồn tại</h2>
              <p className="text-muted-foreground mb-6">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/courses">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
              <h1 className="text-2xl font-bold gradient-heading">Chi tiết khóa học</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-lg overflow-hidden bg-card border">
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className={`difficulty-badge-${course.level}`}>
                        {course.level === 'beginner' ? 'Cơ bản' : 
                         course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                      </Badge>
                      {course.categories && course.categories.length > 0 && course.categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                    
                    <p className="text-muted-foreground mb-6">
                      {course.description}
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{course.enrollmentCount} học viên</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{course.lessonsCount} bài học</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Có chứng chỉ</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="curriculum">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="curriculum">Nội dung</TabsTrigger>
                    <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
                    <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="curriculum" className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {course.modules && course.modules.length > 0 ? (
                        course.modules.map((module, index) => (
                          <AccordionItem key={module.id} value={`module-${module.id}`}>
                            <AccordionTrigger className="text-base font-medium">
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">
                                  {index + 1}.
                                </span>
                                {module.title}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pl-6">
                                {module.lessons && module.lessons.length > 0 ? (
                                  module.lessons.map((lesson) => (
                                    <div key={lesson.id} className="border rounded-md p-3">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                          {lesson.type === 'video' ? (
                                            <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          ) : (
                                            <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                          )}
                                          <span>{lesson.title}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {lesson.duration}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center text-sm text-muted-foreground py-2">Không có bài học nào.</div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">Khóa học này chưa có nội dung.</div>
                      )}
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="instructor">
                    {course.instructor && (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                              {course.instructor.avatarUrl ? (
                                <img 
                                  src={course.instructor.avatarUrl} 
                                  alt={course.instructor.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                                  {course.instructor.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{course.instructor.name}</h3>
                              <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                            </div>
                          </div>
                          <p className="mb-4">{course.instructor.bio}</p>
                          
                          <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div className="bg-muted p-3 rounded-md">
                              <div className="font-semibold">{course.instructor.courseCount}</div>
                              <div className="text-muted-foreground">Khóa học</div>
                            </div>
                            <div className="bg-muted p-3 rounded-md">
                              <div className="font-semibold">{course.instructor.studentCount}</div>
                              <div className="text-muted-foreground">Học viên</div>
                            </div>
                            <div className="bg-muted p-3 rounded-md">
                              <div className="font-semibold">{course.instructor.reviewScore}/5</div>
                              <div className="text-muted-foreground">Đánh giá</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    {course.reviews && course.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {course.reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium mr-3">
                                    {review.userName.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium">{review.userName}</div>
                                    <div className="text-sm text-muted-foreground">{review.date}</div>
                                  </div>
                                </div>
                                <div className="flex">
                                  {Array(5).fill(0).map((_, i) => (
                                    <svg 
                                      key={i}
                                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <p className="mt-3">{review.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">Chưa có đánh giá nào cho khóa học này</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <Card className="sticky top-6">
                  <CardContent className="p-0">
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="mb-6">
                        {course.price > 0 ? (
                          <div className="flex items-baseline mb-2">
                            <span className="text-3xl font-bold">{course.price.toLocaleString()} đ</span>
                            {course.originalPrice > course.price && (
                              <span className="ml-2 text-muted-foreground line-through">
                                {course.originalPrice.toLocaleString()} đ
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="mb-2">
                            <span className="text-3xl font-bold text-green-600">Miễn phí</span>
                          </div>
                        )}
                      </div>
                      
                      {course.isEnrolled ? (
                        <Button className="w-full mb-4" asChild>
                          <Link href={`/lessons/${course.firstLessonId}`}>
                            Tiếp tục học
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          className="w-full mb-4" 
                          onClick={() => enrollMutation.mutate()}
                          disabled={enrollMutation.isPending}
                        >
                          {enrollMutation.isPending ? "Đang đăng ký..." : "Đăng ký khóa học"}
                        </Button>
                      )}
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">Khóa học bao gồm:</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                            <span>{course.lessonsCount} bài học</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                            <span>{course.videoDuration || 0} giờ video</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                            <span>{course.resourcesCount || 0} tài liệu</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                            <span>{course.exercisesCount || 0} bài tập thực hành</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                            <span>Truy cập không giới hạn</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2 text-green-500" />
                            <span>Chứng chỉ hoàn thành</span>
                          </div>
                        </div>

                        <Separator />
                        
                        <div>
                          <h3 className="font-semibold mb-2">Chia sẻ:</h3>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                              </svg>
                            </Button>
                            <Button variant="outline" size="icon">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                              </svg>
                            </Button>
                            <Button variant="outline" size="icon">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
