import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface LearningPathProps {
  path: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    courseCount: number;
    duration: string;
    progress?: number;
    categories: Array<{ id: number; name: string }>;
    enrolled?: boolean;
    firstCourseId?: number;
  };
}

export function LearningPath({ path }: LearningPathProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        {path.imageUrl ? (
          <img 
            src={path.imageUrl} 
            alt={path.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {path.progress !== undefined && (
          <div className="absolute inset-x-0 bottom-0 px-4 py-2 bg-background/90 backdrop-blur-sm">
            <div className="flex justify-between text-xs mb-1">
              <span>Tiến độ</span>
              <span>{path.progress}%</span>
            </div>
            <Progress value={path.progress} className="h-1.5" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {path.categories.slice(0, 2).map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {path.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">+{path.categories.length - 2}</Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{path.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {path.description}
        </p>
        
        <div className="flex text-xs text-muted-foreground">
          <span className="mr-4">{path.courseCount} khóa học</span>
          <span>{path.duration}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        {path.enrolled && path.firstCourseId ? (
          <Button className="w-full" asChild>
            <Link href={`/courses/${path.firstCourseId}`}>
              Tiếp tục học
            </Link>
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/learning-paths/${path.id}`}>
              Xem chi tiết
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
