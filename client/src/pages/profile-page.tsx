import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Badge from "@/components/Badge";
import Achievement from "@/components/Achievement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaGraduationCap, FaAward, FaMedal, FaUserClock } from "react-icons/fa";
import type { Badge as BadgeType, Achievement as AchievementType } from "@shared/schema";

export default function ProfilePage() {
  const [_, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("badges");

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const { data: userBadges, isLoading: isBadgesLoading } = useQuery({
    queryKey: ["/api/user/badges"],
    queryFn: () => apiRequest("/api/user/badges"),
    enabled: !!user,
  });

  const { data: userAchievements, isLoading: isAchievementsLoading } = useQuery({
    queryKey: ["/api/user/achievements"],
    queryFn: () => apiRequest("/api/user/achievements"),
    enabled: !!user,
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Card className="w-full md:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold">{user.displayName || user.username}</h3>
                <p className="text-gray-500">{user.email || "Chưa cập nhật email"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <StatCard 
                  icon={<FaGraduationCap />} 
                  title="Khóa học" 
                  value={user.stats?.completedCourses || 0} 
                />
                <StatCard 
                  icon={<FaAward />} 
                  title="Huy hiệu" 
                  value={userBadges?.length || 0} 
                />
                <StatCard 
                  icon={<FaMedal />} 
                  title="Thành tích" 
                  value={userAchievements?.filter(a => a.completed)?.length || 0} 
                />
                <StatCard 
                  icon={<FaUserClock />} 
                  title="Giờ học" 
                  value={user.stats?.totalLearningTime || 0} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full md:w-2/3">
            <CardHeader className="pb-2">
              <CardTitle>Tổng quan tiến độ</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="badges" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="badges">Huy hiệu</TabsTrigger>
                  <TabsTrigger value="achievements">Thành tích</TabsTrigger>
                </TabsList>

                <TabsContent value="badges" className="mt-0">
                  {isBadgesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="h-32">
                          <CardContent className="p-4 h-full flex items-center">
                            <Skeleton className="h-16 w-16 rounded-lg mr-4" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-4 w-[100px]" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userBadges.map((badge) => (
                        <Badge 
                          key={badge.id} 
                          badge={badge} 
                          showEarnedDate 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaAward className="mx-auto text-4xl text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium">Chưa có huy hiệu nào</h3>
                      <p className="text-gray-500 mt-1">Hoàn thành các khóa học và thành tích để nhận huy hiệu</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="achievements" className="mt-0">
                  {isAchievementsLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="h-40">
                          <CardHeader className="p-4 pb-2">
                            <Skeleton className="h-5 w-[200px]" />
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-2 w-full mb-2" />
                            <Skeleton className="h-4 w-[150px]" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : userAchievements && userAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {userAchievements.map((achievement) => (
                        <Achievement 
                          key={achievement.id} 
                          achievement={achievement} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaMedal className="mx-auto text-4xl text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium">Chưa có thành tích nào</h3>
                      <p className="text-gray-500 mt-1">Tiếp tục học tập để mở khóa thành tích</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
      <div className="text-primary text-xl mb-1">{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-gray-500">{title}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="w-full md:w-2/3">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}