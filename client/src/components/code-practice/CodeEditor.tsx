import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Code, Info, Play, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";

export type CodeLanguage = 'javascript' | 'python' | 'html' | 'css';

const languageMap = {
  javascript: 'javascript',
  python: 'python',
  html: 'html',
  css: 'css',
};

export interface CodeEditorProps {
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
      return 'js';
    case 'python':
      return 'py';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    default:
      return 'txt';
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
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (language === 'html' || language === 'css') {
      // For HTML/CSS, consider updating a preview
    }
  }, [code, language]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    setIsError(false);
    setIsSuccess(false);
    
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // Create a safe environment to run JS code
          const originalLog = console.log;
          let result = '';
          
          // Override console.log to capture output
          console.log = (...args) => {
            result += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
          };
          
          try {
            // Execute the code
            // eslint-disable-next-line no-new-func
            new Function(code)();
            
            // Check if output matches expected
            if (expectedOutput && result.trim() === expectedOutput.trim()) {
              setIsSuccess(true);
              if (onComplete) onComplete();
            }
            
            setOutput(result);
          } catch (err) {
            if (err instanceof Error) {
              setOutput(`Lỗi: ${err.message}`);
              setIsError(true);
            }
          } finally {
            console.log = originalLog;
          }
        } else if (language === 'html' || language === 'css') {
          // For HTML/CSS, just consider it successful if they've modified the code
          if (code !== defaultCode) {
            setIsSuccess(true);
            if (onComplete) onComplete();
          }
          setOutput('HTML/CSS được cập nhật.');
        } else {
          setOutput(`Ngôn ngữ ${language} không được hỗ trợ chạy trực tiếp trong trình duyệt.`);
        }
      } catch (error) {
        if (error instanceof Error) {
          setOutput(`Lỗi: ${error.message}`);
          setIsError(true);
        }
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };

  return (
    <Card className="shadow-lg border-2">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          {description && <p className="text-muted-foreground mb-4">{description}</p>}
        </div>

        <Tabs defaultValue="editor" className="mb-4">
          <TabsList className="mb-2">
            <TabsTrigger value="editor" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
            {hint && (
              <TabsTrigger value="hint" className="flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Gợi ý
              </TabsTrigger>
            )}
            {solution && (
              <TabsTrigger value="solution" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Giải pháp
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="editor">
            <div className="border rounded-md overflow-hidden mb-4">
              <div className="bg-muted p-2 text-xs flex justify-between items-center border-b">
                <span>main.{getLanguageExtension(language)}</span>
              </div>
              <Editor
                height="250px"
                language={languageMap[language]}
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
          </TabsContent>
          
          {hint && (
            <TabsContent value="hint">
              <Alert className="mb-4">
                <Info className="h-4 w-4 mr-2" />
                <AlertDescription>{hint}</AlertDescription>
              </Alert>
            </TabsContent>
          )}
          
          {solution && (
            <TabsContent value="solution">
              <div className="border rounded-md overflow-hidden mb-4">
                <div className="bg-muted p-2 text-xs border-b">
                  <span>Giải pháp</span>
                </div>
                <Editor
                  height="250px"
                  language={languageMap[language]}
                  theme="vs-dark"
                  value={solution}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center"
          >
            <Play className="w-4 h-4 mr-2" />
            {language === 'html' || language === 'css' ? 'Cập nhật' : 'Chạy Code'}
          </Button>
          
          {isSuccess && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span>Chính xác!</span>
            </div>
          )}
        </div>

        {/* Output area */}
        {(output || expectedOutput) && (
          <div className="border rounded-md">
            <div className="bg-muted p-2 text-xs border-b">
              <span>Output</span>
            </div>
            <div className={`p-3 ${isError ? 'text-red-500' : ''} ${isSuccess ? 'text-green-600' : ''} font-mono text-sm whitespace-pre-wrap`}>
              {output || 'Nhấn "Chạy Code" để xem kết quả.'}
            </div>
            
            {expectedOutput && !isSuccess && (
              <div className="border-t p-3">
                <div className="flex items-center mb-1 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  <span>Output mong đợi:</span>
                </div>
                <div className="font-mono text-sm text-muted-foreground">
                  {expectedOutput}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}