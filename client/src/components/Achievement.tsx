import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge, Achievement as AchievementType } from "@shared/schema";
import { cn } from "@/lib/utils";

type AchievementProps = {
  achievement: AchievementType & { 
    progress: number; 
    completed: boolean; 
    completedAt?: Date;
    badge?: Badge;
  };
  className?: string;
};

export default function Achievement({ achievement, className }: AchievementProps) {
  const achievementTypeColors = {
    login_streak: "bg-gradient-to-r from-green-500 to-green-700",
    course_completion: "bg-gradient-to-r from-blue-500 to-blue-700",
    perfect_quiz: "bg-gradient-to-r from-purple-500 to-purple-700",
    community_contribution: "bg-gradient-to-r from-yellow-500 to-yellow-700",
  };

  const color = achievementTypeColors[achievement.type as keyof typeof achievementTypeColors] || 
    achievementTypeColors.course_completion;

  // Calculate progress percentage
  const progressPercentage = Math.min(
    100, 
    Math.round((achievement.progress / achievement.requiredCount) * 100)
  );

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-lg", className)}>
      <div className={cn("h-2", color)} />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            {achievement.name}
            {achievement.completed && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Hoàn thành
              </span>
            )}
          </CardTitle>
          {achievement.completedAt && (
            <span className="text-xs text-gray-500">
              {new Date(achievement.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-3 text-sm text-gray-600">{achievement.description}</p>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span>Tiến độ</span>
            <span>{achievement.progress} / {achievement.requiredCount}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={cn(
              "h-2", 
              achievement.completed ? "bg-green-200" : "bg-gray-200",
              "rounded-full",
              "[&>div]:bg-gradient-to-r",
              achievement.completed ? "[&>div]:from-green-500 [&>div]:to-green-600" : 
                color === achievementTypeColors.login_streak ? "[&>div]:from-green-500 [&>div]:to-green-700" :
                color === achievementTypeColors.course_completion ? "[&>div]:from-blue-500 [&>div]:to-blue-700" :
                color === achievementTypeColors.perfect_quiz ? "[&>div]:from-purple-500 [&>div]:to-purple-700" :
                "[&>div]:from-yellow-500 [&>div]:to-yellow-700"
            )}
          />
        </div>
        
        {achievement.badge && (
          <div className="mt-4 flex items-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              achievement.completed ? color : "bg-gray-200"
            )}>
              {achievement.badge.imageUrl ? (
                <img 
                  src={achievement.badge.imageUrl} 
                  alt={achievement.badge.name} 
                  className="w-4 h-4 object-contain" 
                />
              ) : (
                <span className="text-xs text-white font-bold">
                  {achievement.badge.name.substring(0, 1)}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {achievement.completed 
                ? "Đã nhận huy hiệu" 
                : "Hoàn thành để nhận huy hiệu"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}