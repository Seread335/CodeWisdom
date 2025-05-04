import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, PlayCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type CodeLanguage = 'javascript' | 'python' | 'html' | 'css';

interface CodeEditorProps {
  title: string;
  description?: string;
  defaultCode: string;
  language: CodeLanguage;
  expectedOutput?: string;
  hint?: string;
  solution?: string;
  onComplete?: () => void;
}

const getLanguageExtension = (language: CodeLanguage) => {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'python':
      return python();
    case 'html':
      return html();
    case 'css':
      return css();
    default:
      return javascript();
  }
};

export function CodeEditor({ 
  title, 
  description, 
  defaultCode, 
  language, 
  expectedOutput,
  hint,
  solution,
  onComplete 
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    setActiveTab('output');

    try {
      let result = '';

      if (language === 'javascript') {
        // Rất cẩn thận với eval(), trong môi trường thực tế, 
        // sử dụng sandbox an toàn như VM2 hoặc thực thi phía server
        try {
          // Tạo một console sahư để bắt console.log
          const originalConsole = window.console.log;
          const logs: string[] = [];
          
          window.console.log = (...args) => {
            logs.push(args.map(arg => String(arg)).join(' '));
            originalConsole(...args);
          };
          
          // eslint-disable-next-line no-new-func
          new Function(code)();
          
          // Khôi phục console.log gốc
          window.console.log = originalConsole;
          
          result = logs.join('\n');
        } catch (jsError) {
          throw new Error(jsError instanceof Error ? jsError.message : String(jsError));
        }
      } else if (language === 'python') {
        // Trong môi trường thực tế, sẽ gửi code đến server để thực thi Python
        setError("Chạy code Python yêu cầu xử lý phía server. Tính năng đang được phát triển.");
        result = "# Kết quả sẽ hiển thị ở đây khi tính năng được hoàn thiện";
      } else if (language === 'html') {
        // Hiển thị kết quả HTML trong iframe
        result = `HTML Preview sẽ hiển thị ở đây`;
        // Trong triển khai thực tế, sử dụng iframe để render HTML
      } else if (language === 'css') {
        // CSS cần kết hợp với HTML để hiển thị
        result = `CSS Preview sẽ hiển thị khi kết hợp với HTML`;
      }
      
      setOutput(result);
      
      // Kiểm tra kết quả nếu có expectedOutput
      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {isCompleted && (
            <span className="text-green-500 flex items-center">
              <Check className="h-5 w-5 mr-1" /> Hoàn thành
            </span>
          )}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'output')}>
        <div className="px-6">
          <TabsList className="grid grid-cols-2 w-52">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">Kết quả</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-0 pt-4">
          <TabsContent value="editor" className="px-6 pb-6 m-0">
            <div className="border rounded-md overflow-hidden">
              <CodeMirror
                value={showSolution ? (solution || code) : code}
                height="300px"
                extensions={[getLanguageExtension(language)]}
                onChange={(value) => {
                  if (!showSolution) setCode(value);
                }}
                theme="dark"
                readOnly={showSolution}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-between">
              <div className="space-x-2">
                <Button 
                  onClick={runCode} 
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {isRunning ? 'Đang chạy...' : 'Chạy code'}
                </Button>
                
                {hint && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                  </Button>
                )}
              </div>
              
              {solution && (
                <Button 
                  variant={showSolution ? "default" : "outline"}
                  onClick={() => setShowSolution(!showSolution)}
                >
                  {showSolution ? 'Quay lại code của bạn' : 'Xem lời giải'}
                </Button>
              )}
            </div>
            
            {showHint && hint && (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Gợi ý</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  {hint}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="output" className="px-6 pb-6 m-0">
            <div className="bg-black text-white p-4 rounded-md min-h-[300px] font-mono text-sm whitespace-pre-wrap">
              {error ? (
                <div className="text-red-400">
                  <strong>Lỗi:</strong>
                  <div>{error}</div>
                </div>
              ) : output ? (
                output
              ) : (
                <div className="text-gray-400 italic">
                  Kết quả sẽ hiển thị ở đây sau khi bạn chạy code.
                </div>
              )}
            </div>
            
            {expectedOutput && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Kết quả mong đợi:</h4>
                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                  {expectedOutput}
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}