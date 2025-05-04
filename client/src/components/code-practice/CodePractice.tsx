import { useState } from 'react';
import { CodeEditor, CodeLanguage } from './CodeEditor';
import { HtmlPreview } from './HtmlPreview';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Check, Trophy } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  language: CodeLanguage;
  defaultCode: string;
  solution: string;
  expectedOutput?: string;
  hint?: string;
  points: number;
}

interface CodePracticeProps {
  exercises: Exercise[];
  lessonId?: number;
  onComplete?: () => void;
}

export function CodePractice({ exercises, lessonId, onComplete }: CodePracticeProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [htmlOutput, setHtmlOutput] = useState('');
  const [cssOutput, setCssOutput] = useState('');
  const { toast } = useToast();

  const currentExercise = exercises[currentExerciseIndex];
  const progress = Math.round((completedExercises.length / exercises.length) * 100);
  const isAllCompleted = completedExercises.length === exercises.length;

  const handleExerciseComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      const newCompletedExercises = [...completedExercises, exerciseId];
      setCompletedExercises(newCompletedExercises);
      
      toast({
        title: "Bài tập hoàn thành!",
        description: `+${currentExercise.points} điểm`,
      });

      if (newCompletedExercises.length === exercises.length && onComplete) {
        onComplete();
      }
    }
  };

  const handleHtmlCssUpdate = (html: string, css: string) => {
    setHtmlOutput(html);
    setCssOutput(css);
  };

  const goToNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold">Bài tập thực hành</h2>
              <p className="text-muted-foreground">
                Hoàn thành {completedExercises.length}/{exercises.length} bài tập
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {exercises.map((exercise, index) => (
                <Badge 
                  key={exercise.id}
                  variant={currentExerciseIndex === index ? "default" : (
                    completedExercises.includes(exercise.id) ? "outline" : "secondary"
                  )}
                  className="cursor-pointer"
                  onClick={() => setCurrentExerciseIndex(index)}
                >
                  {completedExercises.includes(exercise.id) && <Check className="h-3 w-3 mr-1" />}
                  {index + 1}
                </Badge>
              ))}
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      {currentExercise.language === 'html' || currentExercise.language === 'css' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CodeEditor
            title={currentExercise.title}
            description={currentExercise.description}
            defaultCode={currentExercise.defaultCode}
            language={currentExercise.language}
            solution={currentExercise.solution}
            hint={currentExercise.hint}
            onComplete={() => handleExerciseComplete(currentExercise.id)}
          />
          
          <Card className="shadow-lg border-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <HtmlPreview 
                html={currentExercise.language === 'html' ? htmlOutput : ''}
                css={currentExercise.language === 'css' ? cssOutput : ''}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <CodeEditor
          key={currentExercise.id}
          title={currentExercise.title}
          description={currentExercise.description}
          defaultCode={currentExercise.defaultCode}
          language={currentExercise.language}
          expectedOutput={currentExercise.expectedOutput}
          solution={currentExercise.solution}
          hint={currentExercise.hint}
          onComplete={() => handleExerciseComplete(currentExercise.id)}
        />
      )}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={goToPreviousExercise}
          disabled={currentExerciseIndex === 0}
        >
          Bài trước
        </Button>
        
        <Button
          variant="outline"
          onClick={goToNextExercise}
          disabled={currentExerciseIndex === exercises.length - 1}
        >
          Bài tiếp theo
        </Button>
      </div>
      
      {isAllCompleted && (
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Chúc mừng! Bạn đã hoàn thành tất cả bài tập!
              </h3>
              <p className="text-green-700 mb-4">
                Bạn đã đạt được {exercises.reduce((total, ex) => total + ex.points, 0)} điểm
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Đi đến bài học tiếp theo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}