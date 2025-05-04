import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeType } from "@shared/schema";
import { cn } from "@/lib/utils";

type BadgeProps = {
  badge: BadgeType & { earnedAt?: Date };
  showEarnedDate?: boolean;
  className?: string;
};

export default function Badge({ badge, showEarnedDate = false, className }: BadgeProps) {
  const badgeTypeColors = {
    course: "bg-gradient-to-r from-blue-500 to-blue-700",
    achievement: "bg-gradient-to-r from-purple-500 to-purple-700",
    streak: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    special: "bg-gradient-to-r from-green-500 to-green-700",
  };

  const badgeColor = badgeTypeColors[badge.type as keyof typeof badgeTypeColors] || 
    badgeTypeColors.achievement;

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-lg", className)}>
      <div className={cn("h-2", badgeColor)} />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{badge.name}</CardTitle>
          {showEarnedDate && badge.earnedAt && (
            <span className="text-xs text-gray-500">
              {new Date(badge.earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4">
          <div 
            className={cn(
              "rounded-lg p-2 flex items-center justify-center", 
              badgeColor,
              "w-16 h-16"
            )}
          >
            {badge.imageUrl ? (
              <img 
                src={badge.imageUrl} 
                alt={badge.name} 
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="text-2xl font-bold text-white">
                {badge.name.substring(0, 2)}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{badge.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}