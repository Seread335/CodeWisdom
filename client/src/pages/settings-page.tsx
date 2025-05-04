import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Shield, User, Globe, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState("vi");
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold gradient-heading mb-6">Cài đặt tài khoản</h1>
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="mb-4">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Hồ sơ cá nhân
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Thông báo
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Bảo mật
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Giao diện
                </TabsTrigger>
              </TabsList>
              
              {/* Hồ sơ cá nhân */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin hồ sơ của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <div className="md:w-1/4 flex flex-col items-center space-y-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="" alt={user?.displayName || user?.username} />
                          <AvatarFallback className="text-2xl">
                            {user?.displayName?.charAt(0) || user?.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">Thay đổi ảnh</Button>
                      </div>
                      
                      <div className="md:w-3/4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Tên hiển thị</Label>
                            <Input id="displayName" value={user?.displayName || ""} placeholder="Tên hiển thị" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Tên người dùng</Label>
                            <Input id="username" value={user?.username || ""} placeholder="Tên người dùng" disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ""} placeholder="Email" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Giới thiệu</Label>
                          <Textarea id="bio" placeholder="Mô tả ngắn về bản thân" rows={4} />
                        </div>
                        
                        <Button>Lưu thay đổi</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Thông báo */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt thông báo</CardTitle>
                    <CardDescription>
                      Quản lý cách bạn nhận thông báo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Thông báo qua email</h3>
                          <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Thông báo đẩy</h3>
                          <p className="text-sm text-muted-foreground">Nhận thông báo đẩy trên trình duyệt</p>
                        </div>
                        <Switch 
                          checked={pushNotifications} 
                          onCheckedChange={setPushNotifications} 
                        />
                      </div>
                    </div>
                    
                    <Button>Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Bảo mật */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật</CardTitle>
                    <CardDescription>
                      Quản lý mật khẩu và bảo mật tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    
                    <Button>Cập nhật mật khẩu</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Giao diện */}
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Giao diện và ngôn ngữ</CardTitle>
                    <CardDescription>
                      Điều chỉnh giao diện và ngôn ngữ của ứng dụng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Chế độ tối</h3>
                          <p className="text-sm text-muted-foreground">Chuyển đổi giữa chế độ sáng và tối</p>
                        </div>
                        <Switch 
                          checked={darkMode} 
                          onCheckedChange={setDarkMode} 
                          className="flex items-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Ngôn ngữ</Label>
                        <select 
                          id="language" 
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button>Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
