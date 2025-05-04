import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSwitch } from "@/components/common/language-switch";

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  displayName: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };
  
  // Redirect to home if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-2">
                <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0.745 8.2 2.793 10.5 7 11.23V20h2v-2.5c7-3.59 7-12.64 7-16.5-3-1.2-7-.7-9 0z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold">CodeWisdom.vn</h1>
              <p className="text-muted-foreground">Nền tảng học lập trình toàn diện</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đăng nhập</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên đăng nhập..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Nhập mật khẩu..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đăng nhập</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên đăng nhập..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên hiển thị</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên hiển thị..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Nhập mật khẩu..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Xác nhận mật khẩu</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Nhập lại mật khẩu..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4 gradient-heading">
            Trở thành chuyên gia IT với <br />
            nền tảng học tập toàn diện
          </h2>
          <p className="text-muted-foreground mb-6">
            CodeWisdom cung cấp các lộ trình học tập theo cấp độ từ cơ bản đến nâng cao,
            giúp bạn trở thành chuyên gia trong lĩnh vực công nghệ thông tin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="font-semibold mb-2">Nội dung toàn diện</div>
              <p className="text-sm text-muted-foreground">
                Bao gồm lập trình, mạng, cơ sở dữ liệu và nhiều lĩnh vực IT khác
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="font-semibold mb-2">Lộ trình học tập</div>
              <p className="text-sm text-muted-foreground">
                Lộ trình từ cơ bản đến nâng cao, phù hợp với mọi trình độ
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="font-semibold mb-2">Thực hành thực tế</div>
              <p className="text-sm text-muted-foreground">
                Các ví dụ thực tế và bài tập giúp củng cố kiến thức
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="font-semibold mb-2">Tiếng Việt 100%</div>
              <p className="text-sm text-muted-foreground">
                Nội dung hoàn toàn bằng tiếng Việt, dễ hiểu cho người học
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-start">
            <Button 
              variant="link" 
              onClick={() => setActiveTab("register")}
              className="font-semibold"
            >
              Đăng ký ngay &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
