import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    level: string;
    duration: string;
    enrollmentCount: number;
    progress?: number;
    categories: Array<{ id: number; name: string }>;
    price?: number;
    originalPrice?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        {course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className={`difficulty-badge-${course.level}`}>
            {course.level === 'beginner' ? 'Cơ bản' : 
             course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
          </Badge>
        </div>
        
        {course.progress !== undefined && (
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-muted">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {course.categories.slice(0, 2).map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {course.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">+{course.categories.length - 2}</Badge>
          )}
        </div>
        
        <div className="flex text-xs text-muted-foreground">
          <div className="flex items-center mr-4">
            <Clock className="h-3 w-3 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{course.enrollmentCount} học viên</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
        <div>
          {typeof course.price !== 'undefined' ? (
            <div className="flex items-baseline space-x-1">
              {course.price > 0 ? (
                <>
                  <span className="font-semibold">{course.price.toLocaleString()}đ</span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-muted-foreground text-xs line-through">
                      {course.originalPrice.toLocaleString()}đ
                    </span>
                  )}
                </>
              ) : (
                <span className="font-semibold text-green-600">Miễn phí</span>
              )}
            </div>
          ) : null}
        </div>
        
        <Link href={`/courses/${course.id}`} className="text-primary hover:underline text-sm font-medium">
          Chi tiết
        </Link>
      </CardFooter>
    </Card>
  );
}
