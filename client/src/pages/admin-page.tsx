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
                        <Label htmlFor="courseImageFile">Hình ảnh khóa học</Label>
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
                        />
                        {form.formState.errors.courseImageFile && (
                          <p className="text-sm text-red-500">{form.formState.errors.courseImageFile.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="courseContentFile">Nội dung khóa học (PDF, ZIP, Word)</Label>
                        <Input
                          id="courseContentFile"
                          type="file"
                          accept=".pdf,.zip,.doc,.docx,.txt"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              form.setValue("courseContentFile", files[0]);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500">
                          Tải lên file chứa nội dung khóa học. Hệ thống sẽ tự động phân tích và phân loại nội dung.
                        </p>
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
              <div className="flex flex-col items-center justify-center h-40">
                <p>Chức năng đang được phát triển</p>
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
              <div className="flex flex-col items-center justify-center h-40">
                <p>Chức năng đang được phát triển</p>
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
              <div className="flex flex-col items-center justify-center h-40">
                <p>Chức năng đang được phát triển</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}