import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Pencil, 
  Plus, 
  Trash,
  UploadCloud,
  BookOpen,
  List,
  MoreHorizontal,
  Users,
  Tag,
  BarChart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(5, "Tiêu đề khóa học ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả khóa học ít nhất 20 ký tự"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Giá phải là số"),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Giá gốc phải là số"),
  categoryIds: z.string().min(1, "Phải chọn ít nhất một danh mục"),
  instructorId: z.string().optional(),
  courseImageFile: z.instanceof(File, { message: "Phải tải lên hình ảnh khóa học" }).optional(),
  courseContentFile: z.instanceof(File, { message: "Phải tải lên nội dung khóa học" }).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPage() {
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await apiRequest("/api/categories");
      return await response.json();
    }
  });

  const { data: instructors, isLoading: isInstructorsLoading } = useQuery({
    queryKey: ["/api/instructors"],
    queryFn: async () => {
      const response = await apiRequest("/api/instructors");
      return await response.json();
    }
  });

  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
    queryFn: async () => {
      const response = await apiRequest("/api/admin/courses");
      return await response.json();
    },
    enabled: !!user && user.role === "admin"
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "beginner",
      price: "0",
      originalPrice: "0",
      categoryIds: "",
      instructorId: ""
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/admin/courses/upload", {
        method: "POST",
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tải lên khóa học mới thành công",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể tải lên khóa học: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return await apiRequest(`/api/admin/courses/${courseId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa khóa học thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa khóa học: " + error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("level", values.level);
      formData.append("price", values.price);
      formData.append("originalPrice", values.originalPrice);
      formData.append("categoryIds", values.categoryIds);
      
      if (values.instructorId) {
        formData.append("instructorId", values.instructorId);
      }
      
      const courseImageFile = form.watch("courseImageFile");
      if (courseImageFile) {
        formData.append("file", courseImageFile);
      }
      
      const courseContentFile = form.watch("courseContentFile");
      if (courseContentFile) {
        formData.append("contentFile", courseContentFile);
      }
      
      uploadMutation.mutate(formData);
    } catch (error) {
      console.error("Error uploading course:", error);
    }
  };

  if (isLoading) {
    return <div className="container py-8">Đang tải...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý - Bảng điều khiển Admin</h1>
        <p className="text-gray-500">Quản lý khóa học, danh mục và người dùng</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Khóa học</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Danh mục</span>
          </TabsTrigger>
          <TabsTrigger value="instructors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Giảng viên</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Thống kê</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Danh sách khóa học</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCourse(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm khóa học
                    </Button>
                  </div>
                  <CardDescription>
                    Quản lý tất cả các khóa học trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCoursesLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : courses && courses.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Khóa học</TableHead>
                            <TableHead>Cấp độ</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((course: any) => (
                            <TableRow key={course.id}>
                              <TableCell>
                                <div className="font-medium">{course.title}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  course.level === "beginner" ? "secondary" :
                                  course.level === "intermediate" ? "outline" : "default"
                                }>
                                  {course.level === "beginner" ? "Cơ bản" :
                                   course.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {course.price.toLocaleString()} đ
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setSelectedCourse(course)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
                                        deleteMutation.mutate(course.id);
                                      }
                                    }}>
                                      <Trash className="h-4 w-4 mr-2" />
                                      Xóa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <p className="text-gray-500 mb-4">Chưa có khóa học nào</p>
                      <Button onClick={() => setSelectedCourse(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm khóa học đầu tiên
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}</CardTitle>
                  <CardDescription>
                    {selectedCourse 
                      ? "Cập nhật thông tin cho khóa học hiện có" 
                      : "Tạo một khóa học mới với đầy đủ thông tin"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề khóa học</Label>
                        <Input
                          id="title"
                          {...form.register("title")}
                          defaultValue={selectedCourse?.title}
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Mô tả khóa học</Label>
                        <Textarea
                          id="description"
                          {...form.register("description")}
                          rows={4}
                          defaultValue={selectedCourse?.description}
                        />
                        {form.formState.errors.description && (
                          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="level">Cấp độ</Label>
                          <Select 
                            defaultValue={selectedCourse?.level || "beginner"}
                            onValueChange={(value) => form.setValue("level", value as "beginner" | "intermediate" | "advanced")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn cấp độ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Cơ bản</SelectItem>
                              <SelectItem value="intermediate">Trung cấp</SelectItem>
                              <SelectItem value="advanced">Nâng cao</SelectItem>
                            </SelectContent>
                          </Select>
                          {form.formState.errors.level && (
                            <p className="text-sm text-red-500">{form.formState.errors.level.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="instructorId">Giảng viên</Label>
                          <Select 
                            defaultValue={selectedCourse?.instructorId?.toString() || ""}
                            onValueChange={(value) => form.setValue("instructorId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giảng viên" />
                            </SelectTrigger>
                            <SelectContent>
                              {!isInstructorsLoading && instructors && instructors.map((instructor: any) => (
                                <SelectItem key={instructor.id} value={instructor.id.toString()}>
                                  {instructor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Giá (VND)</Label>
                          <Input
                            id="price"
                            type="text"
                            {...form.register("price")}
                            defaultValue={selectedCourse?.price || "0"}
                          />
                          {form.formState.errors.price && (
                            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="originalPrice">Giá gốc (VND)</Label>
                          <Input
                            id="originalPrice"
                            type="text"
                            {...form.register("originalPrice")}
                            defaultValue={selectedCourse?.originalPrice || "0"}
                          />
                          {form.formState.errors.originalPrice && (
                            <p className="text-sm text-red-500">{form.formState.errors.originalPrice.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoryIds">Danh mục</Label>
                        <Select 
                          defaultValue={selectedCourse?.categoryIds || ""}
                          onValueChange={(value) => form.setValue("categoryIds", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            {!isCategoriesLoading && categories && categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.categoryIds && (
                          <p className="text-sm text-red-500">{form.formState.errors.categoryIds.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="courseImageFile">Hình ảnh bìa khóa học</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            id="courseImageFile"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                form.setValue("courseImageFile", files[0]);
                              }
                            }}
                            className="mb-2"
                          />
                          <div className="relative h-32 border rounded-md">
                            {form.watch("courseImageFile") ? (
                              <img 
                                src={form.watch("courseImageFile") ? URL.createObjectURL(form.watch("courseImageFile") as File) : ""}
                                alt="Preview"
                                className="h-full w-full object-contain p-2 rounded-md"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400 text-sm">Xem trước hình ảnh</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {form.formState.errors.courseImageFile && (
                          <p className="text-sm text-red-500">{form.formState.errors.courseImageFile.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="courseContentFile">Nội dung khóa học (TXT, JSON hoặc Markdown)</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            id="courseContentFile"
                            type="file"
                            accept=".txt,.json,.md,.markdown"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                form.setValue("courseContentFile", files[0]);
                                
                                // Hiển thị tên file đã chọn
                                const fileNameElement = document.getElementById('selectedFileName');
                                if (fileNameElement) {
                                  fileNameElement.textContent = files[0].name;
                                }
                              }
                            }}
                          />
                          <div className="flex mt-1">
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs">
                              <span id="selectedFileName">Chưa chọn tệp</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-xs space-y-2">
                          <p className="font-medium">Hướng dẫn định dạng tệp nội dung:</p>
                          <p>1. <strong>Tệp TXT</strong>: Sử dụng # để đánh dấu tiêu đề mô-đun, ## để đánh dấu tiêu đề bài học</p>
                          <p>2. <strong>Tệp JSON</strong>: Cấu trúc mảng với các mô-đun và bài học (xem ví dụ bên dưới)</p>
                          <details className="cursor-pointer">
                            <summary className="font-medium">Xem ví dụ định dạng JSON</summary>
                            <pre className="mt-1 overflow-auto text-xs p-2 bg-gray-800 text-gray-200 rounded-md">
                              {JSON.stringify([
                                {
                                  title: "Tên module 1",
                                  description: "Mô tả module 1",
                                  lessons: [
                                    {
                                      title: "Tên bài học 1",
                                      content: "Nội dung bài học 1...",
                                      type: "text",
                                      duration: 30
                                    }
                                  ]
                                }
                              ], null, 2)}
                            </pre>
                          </details>
                        </div>
                        {form.formState.errors.courseContentFile && (
                          <p className="text-sm text-red-500">{form.formState.errors.courseContentFile.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
                        {uploadMutation.isPending ? (
                          <span>Đang xử lý...</span>
                        ) : (
                          <>
                            <UploadCloud className="h-4 w-4 mr-2" />
                            {selectedCourse ? "Cập nhật khóa học" : "Tải lên khóa học mới"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {selectedCourse && (
                    <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
                      Thêm khóa học mới
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý danh mục</CardTitle>
              <CardDescription>Quản lý tất cả các danh mục của hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Thêm danh mục mới</h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="categoryName">Tên danh mục</Label>
                      <Input id="categoryName" placeholder="Nhập tên danh mục mới" />
                    </div>
                    <div>
                      <Label htmlFor="categoryDesc">Mô tả</Label>
                      <Textarea id="categoryDesc" placeholder="Mô tả ngắn về danh mục" />
                    </div>
                    <div>
                      <Label htmlFor="categoryIcon">Biểu tượng</Label>
                      <Input id="categoryIcon" placeholder="fa-code, fa-server, v.v." />
                      <p className="text-xs text-gray-500 mt-1">Sử dụng tên biểu tượng từ Font Awesome</p>
                    </div>
                    <Button className="w-full mt-2">
                      Thêm danh mục
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Danh mục hiện tại</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div>
                        <span className="font-medium">Lập trình Frontend</span>
                        <p className="text-sm text-gray-500">HTML, CSS, JavaScript, React</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Sửa</Button>
                        <Button variant="destructive" size="sm">Xóa</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div>
                        <span className="font-medium">Lập trình Backend</span>
                        <p className="text-sm text-gray-500">Node.js, Express, Django, Laravel</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Sửa</Button>
                        <Button variant="destructive" size="sm">Xóa</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div>
                        <span className="font-medium">DevOps</span>
                        <p className="text-sm text-gray-500">Docker, Kubernetes, CI/CD</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Sửa</Button>
                        <Button variant="destructive" size="sm">Xóa</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý giảng viên</CardTitle>
              <CardDescription>Quản lý thông tin về giảng viên trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Danh sách giảng viên</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                          <span>HTB</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Huỳnh Thái Bảo</h4>
                          <p className="text-sm text-gray-600">Giảng viên Lập trình, Cloud Computing</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">10 khóa học</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Đang hoạt động</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Xem chi tiết</Button>
                          <Button variant="destructive" size="sm">Xóa</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                        <div className="h-16 w-16 rounded-full bg-primary/80 flex items-center justify-center text-white text-xl">
                          <span>NVA</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Nguyễn Văn An</h4>
                          <p className="text-sm text-gray-600">Giảng viên An ninh mạng</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">6 khóa học</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Đang hoạt động</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Xem chi tiết</Button>
                          <Button variant="destructive" size="sm">Xóa</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Thêm giảng viên mới</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="instructorName">Tên giảng viên</Label>
                        <Input id="instructorName" placeholder="Nhập họ tên đầy đủ" />
                      </div>
                      <div>
                        <Label htmlFor="instructorSpecialization">Chuyên môn</Label>
                        <Input id="instructorSpecialization" placeholder="Lập trình, AI, DevOps,..." />
                      </div>
                      <div>
                        <Label htmlFor="instructorBio">Tiểu sử</Label>
                        <Textarea id="instructorBio" placeholder="Giới thiệu ngắn về giảng viên" rows={4} />
                      </div>
                      <div>
                        <Label htmlFor="instructorAvatar">Ảnh đại diện</Label>
                        <Input id="instructorAvatar" type="file" accept="image/*" />
                      </div>
                      <Button className="w-full mt-3">
                        Thêm giảng viên
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
              <CardDescription>Xem các thống kê về người dùng và khóa học</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="border rounded-md shadow-sm p-4 bg-white">
                  <h3 className="text-gray-500 font-medium text-sm mb-2">Tổng số người dùng</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">1,205</span>
                    <span className="text-green-500 ml-2 text-sm">+5.6%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">So với tháng trước</p>
                </div>
                
                <div className="border rounded-md shadow-sm p-4 bg-white">
                  <h3 className="text-gray-500 font-medium text-sm mb-2">Khóa học</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">68</span>
                    <span className="text-green-500 ml-2 text-sm">+2.1%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">8 khóa học mới trong tháng</p>
                </div>
                
                <div className="border rounded-md shadow-sm p-4 bg-white">
                  <h3 className="text-gray-500 font-medium text-sm mb-2">Ghi danh</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">3,945</span>
                    <span className="text-green-500 ml-2 text-sm">+12.3%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tăng mạnh so với quý trước</p>
                </div>
                
                <div className="border rounded-md shadow-sm p-4 bg-white">
                  <h3 className="text-gray-500 font-medium text-sm mb-2">Doanh thu</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">62.5M</span>
                    <span className="text-green-500 ml-2 text-sm">+8.4%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Đơn vị: VNĐ</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-white p-4 border-b">
                    <h3 className="font-semibold">Khóa học phổ biến</h3>
                  </div>
                  <div className="bg-white divide-y">
                    <div className="p-3 flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary mr-3">1</div>
                      <div className="flex-1">
                        <span className="font-medium">Lập trình Web Frontend với React</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>892 học viên</span>
                          <span className="mx-2">•</span>
                          <span>4.8 ⭐</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary mr-3">2</div>
                      <div className="flex-1">
                        <span className="font-medium">Docker & Kubernetes - Từ cơ bản đến nâng cao</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>754 học viên</span>
                          <span className="mx-2">•</span>
                          <span>4.7 ⭐</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary mr-3">3</div>
                      <div className="flex-1">
                        <span className="font-medium">Điện toán đám mây với AWS</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>681 học viên</span>
                          <span className="mx-2">•</span>
                          <span>4.9 ⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-white p-4 border-b">
                    <h3 className="font-semibold">Người dùng mới nhất</h3>
                  </div>
                  <div className="bg-white p-4 space-y-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">TH</div>
                      <div className="flex-1">
                        <span className="font-medium">Trần Hưng</span>
                        <p className="text-sm text-gray-500">Đã đăng ký: 2 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">NL</div>
                      <div className="flex-1">
                        <span className="font-medium">Nguyễn Linh</span>
                        <p className="text-sm text-gray-500">Đã đăng ký: 5 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">LH</div>
                      <div className="flex-1">
                        <span className="font-medium">Lê Hương</span>
                        <p className="text-sm text-gray-500">Đã đăng ký: 1 ngày trước</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}