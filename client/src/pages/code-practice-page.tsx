import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CodePractice, Exercise } from "@/components/code-practice/CodePractice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dữ liệu ví dụ các bài tập
const javaScriptExercises: Exercise[] = [
  {
    id: "js-1",
    title: "In ra màn hình",
    description: "Sử dụng console.log để in ra 'Hello, World!'",
    language: "javascript",
    defaultCode: "// Viết code của bạn ở đây\n",
    solution: "// Viết code của bạn ở đây\nconsole.log('Hello, World!');",
    expectedOutput: "Hello, World!",
    hint: "Sử dụng hàm console.log() để in ra nội dung",
    points: 10
  },
  {
    id: "js-2",
    title: "Tính tổng hai số",
    description: "Viết hàm sum nhận vào hai số và trả về tổng của chúng, sau đó gọi hàm và in kết quả với tham số 5 và 3",
    language: "javascript",
    defaultCode: "// Viết hàm sum ở đây\n\n// Gọi hàm và in kết quả\n",
    solution: "// Viết hàm sum ở đây\nfunction sum(a, b) {\n  return a + b;\n}\n\n// Gọi hàm và in kết quả\nconsole.log(sum(5, 3));",
    expectedOutput: "8",
    hint: "Định nghĩa hàm sum với hai tham số, sau đó sử dụng console.log(sum(5, 3)) để in kết quả",
    points: 20
  },
  {
    id: "js-3",
    title: "Kiểm tra số chẵn lẻ",
    description: "Viết hàm kiểm tra một số là chẵn hay lẻ và in ra kết quả tương ứng cho số 7",
    language: "javascript",
    defaultCode: "// Viết hàm kiểm tra số chẵn lẻ\n\n// Kiểm tra và in kết quả cho số 7\n",
    solution: "// Viết hàm kiểm tra số chẵn lẻ\nfunction checkEvenOdd(num) {\n  if (num % 2 === 0) {\n    return 'Số chẵn';\n  } else {\n    return 'Số lẻ';\n  }\n}\n\n// Kiểm tra và in kết quả cho số 7\nconsole.log(checkEvenOdd(7));",
    expectedOutput: "Số lẻ",
    hint: "Sử dụng toán tử % (chia lấy dư) để kiểm tra số chẵn lẻ",
    points: 30
  }
];

const htmlExercises: Exercise[] = [
  {
    id: "html-1",
    title: "Tạo tiêu đề cho trang web",
    description: "Tạo một tiêu đề cấp 1 (h1) với nội dung 'Trang web của tôi'",
    language: "html",
    defaultCode: "<!-- Viết code HTML ở đây -->\n",
    solution: "<!-- Viết code HTML ở đây -->\n<h1>Trang web của tôi</h1>",
    hint: "Sử dụng thẻ h1 để tạo tiêu đề cấp 1",
    points: 10
  },
  {
    id: "html-2",
    title: "Tạo một danh sách không thứ tự",
    description: "Tạo một danh sách không thứ tự (ul) có 3 mục: 'HTML', 'CSS', 'JavaScript'",
    language: "html",
    defaultCode: "<!-- Viết code HTML ở đây -->\n",
    solution: "<!-- Viết code HTML ở đây -->\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>",
    hint: "Sử dụng thẻ ul cho danh sách và thẻ li cho mỗi mục trong danh sách",
    points: 20
  }
];

export default function CodePracticePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "html">("javascript");
  const { toast } = useToast();

  const handleComplete = () => {
    toast({
      title: "Hoàn thành tất cả bài tập!",
      description: "Chúc mừng bạn đã hoàn thành tất cả bài tập thực hành.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-heading mb-2">Thực hành code</h1>
              <p className="text-muted-foreground mb-6">
                Luyện tập kỹ năng lập trình với các bài tập tương tác
              </p>
              
              <div className="flex gap-2 mb-6">
                <Button
                  variant={selectedLanguage === "javascript" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("javascript")}
                  className="flex items-center"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  JavaScript
                  {selectedLanguage === "javascript" && <Check className="h-4 w-4 ml-2" />}
                </Button>
                
                <Button
                  variant={selectedLanguage === "html" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("html")}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 17l2-7h8l2 7"></path>
                    <rect x="4" y="4" width="16" height="6" rx="1"></rect>
                    <path d="M6 20h12"></path>
                  </svg>
                  HTML
                  {selectedLanguage === "html" && <Check className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </div>
            
            <CodePractice 
              exercises={selectedLanguage === "javascript" ? javaScriptExercises : htmlExercises}
              onComplete={handleComplete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}