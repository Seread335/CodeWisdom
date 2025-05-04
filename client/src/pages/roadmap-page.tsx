import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccordionTrigger, AccordionContent, AccordionItem, Accordion } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Check } from "lucide-react";

export default function RoadmapPage() {
  const { user } = useAuth();

  // Các danh mục kiến thức theo chủ đề
  const categories = [
    {
      id: "foundations",
      name: "Nền tảng CNTT",
      topics: [
        {
          title: "Kiến thức máy tính cơ bản",
          items: [
            { name: "Phần cứng máy tính", complete: true },
            { name: "Hệ điều hành", complete: true },
            { name: "Mạng máy tính cơ bản", complete: false },
            { name: "Bảo mật thông tin", complete: false },
          ],
        },
        {
          title: "Công cụ phát triển phần mềm",
          items: [
            { name: "Terminal/Command Line", complete: true },
            { name: "Text Editors/IDEs", complete: true },
            { name: "Git & GitHub", complete: false },
            { name: "Docker cơ bản", complete: false },
          ],
        },
      ],
    },
    {
      id: "programming",
      name: "Lập trình cơ bản",
      topics: [
        {
          title: "Tư duy lập trình",
          items: [
            { name: "Biến, kiểu dữ liệu, toán tử", complete: true },
            { name: "Cấu trúc điều khiển (if, loop)", complete: true },
            { name: "Hàm và module", complete: false },
            { name: "Giải thuật cơ bản", complete: false },
          ],
        },
        {
          title: "Ngôn ngữ lập trình cơ bản",
          items: [
            { name: "Python cơ bản", complete: true },
            { name: "JavaScript cơ bản", complete: false },
            { name: "C/C++ cơ bản", complete: false },
          ],
        },
        {
          title: "Cấu trúc dữ liệu",
          items: [
            { name: "Mảng và chuỗi", complete: true },
            { name: "Stack, Queue, Linked List", complete: false },
            { name: "Sets, Maps, Hash Tables", complete: false },
            { name: "Tree, Graph", complete: false },
          ],
        },
      ],
    },
    {
      id: "web",
      name: "Phát triển Web",
      topics: [
        {
          title: "Frontend cơ bản",
          items: [
            { name: "HTML5", complete: false },
            { name: "CSS3 & Responsive Design", complete: false },
            { name: "JavaScript (ES6+)", complete: false },
            { name: "DOM Manipulation", complete: false },
          ],
        },
        {
          title: "Frontend nâng cao",
          items: [
            { name: "React.js", complete: false },
            { name: "State Management (Redux)", complete: false },
            { name: "UI Frameworks (TailwindCSS)", complete: false },
            { name: "Testing (Jest, RTL)", complete: false },
          ],
        },
        {
          title: "Backend",
          items: [
            { name: "Node.js & Express", complete: false },
            { name: "RESTful APIs", complete: false },
            { name: "Authentication & Authorization", complete: false },
            { name: "Database Integration", complete: false },
          ],
        },
      ],
    },
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      topics: [
        {
          title: "Toán học cho ML",
          items: [
            { name: "Linear Algebra", complete: false },
            { name: "Calculus", complete: false },
            { name: "Statistics & Probability", complete: false },
          ],
        },
        {
          title: "Machine Learning cơ bản",
          items: [
            { name: "Python cho Data Science", complete: false },
            { name: "Data Manipulation (Numpy, Pandas)", complete: false },
            { name: "Visualization (Matplotlib, Seaborn)", complete: false },
            { name: "ML Algorithms", complete: false },
          ],
        },
        {
          title: "Deep Learning",
          items: [
            { name: "Neural Networks", complete: false },
            { name: "TensorFlow/PyTorch", complete: false },
            { name: "Computer Vision", complete: false },
            { name: "NLP", complete: false },
          ],
        },
      ],
    },
  ];

  // Thông tin lộ trình cụ thể theo từng cấp độ (cho tab cấp độ)
  const levelRoadmaps = [
    {
      id: "beginner",
      title: "Người mới bắt đầu",
      description: "Lộ trình cho người chưa có kiến thức về lập trình và CNTT",
      steps: [
        "Tiếp cận với các khái niệm cơ bản về máy tính, phần cứng và phần mềm",
        "Làm quen với hệ điều hành, terminal và các công cụ cơ bản",
        "Học Python - ngôn ngữ lập trình dễ học cho người mới",
        "Hiểu về các khái niệm cơ bản: biến, kiểu dữ liệu, hàm, điều kiện, vòng lặp",
        "Làm quen với cấu trúc dữ liệu cơ bản: mảng, chuỗi, từ điển",
        "Tiếp cận với về HTML và CSS cơ bản để hiểu về web",
        "Học cách sử dụng Git cơ bản để quản lý mã nguồn",
        "Xây dựng các dự án đơn giản để áp dụng kiến thức",
      ],
      courses: [
        "Nhập môn lập trình với Python",
        "Nền tảng CNTT cho người mới bắt đầu",
        "HTML & CSS cơ bản",
        "Git và GitHub cho người mới",
      ],
    },
    {
      id: "intermediate",
      title: "Trung cấp",
      description: "Lộ trình cho người đã có kiến thức cơ bản về lập trình",
      steps: [
        "Nâng cao kỹ năng lập trình với các dự án phức tạp hơn",
        "Phát triển hiểu biết về cấu trúc dữ liệu và giải thuật",
        "Học JavaScript nâng cao và các frontend framework",
        "Tiếp cận với backend development với Node.js hoặc Python frameworks",
        "Hiểu về cơ sở dữ liệu và cách làm việc với SQL/NoSQL",
        "Nắm vững các concept về RESTful APIs và web services",
        "Tìm hiểu về DevOps cơ bản, CI/CD và Cloud services",
        "Xây dựng các ứng dụng fullstack hoặc mobile apps",
      ],
      courses: [
        "Phát triển web với JavaScript và Node.js",
        "Cấu trúc dữ liệu và giải thuật",
        "Cơ sở dữ liệu SQL và NoSQL",
        "React.js cho frontend development",
        "Điện toán đám mây với AWS",
      ],
    },
    {
      id: "advanced",
      title: "Nâng cao",
      description: "Lộ trình cho lập trình viên có kinh nghiệm muốn chuyên sâu",
      steps: [
        "Chuyên sâu về kiến trúc phần mềm và design patterns",
        "Học về Microservices và Serverless Architecture",
        "Tiếp cận với AI/Machine Learning và Data Science",
        "Nâng cao hiểu biết về bảo mật và performance optimization",
        "Phát triển kỹ năng devops nâng cao: Kubernetes, Infrastructure as Code",
        "Nghiên cứu công nghệ mới: Blockchain, IoT, AR/VR",
        "Phát triển kỹ năng quản lý dự án và lãnh đạo kỹ thuật",
        "Xây dựng các hệ thống phức tạp, có khả năng mở rộng (scalable)",
      ],
      courses: [
        "Kiến trúc vi dịch vụ (Microservices)",
        "Machine Learning và AI cơ bản",
        "DevOps và CI/CD nâng cao",
        "Blockchain và Web3",
        "Kiến trúc phần mềm nâng cao",
      ],
    },
  ];

  // Định nghĩa types
  type RoadmapItem = { name: string; complete: boolean };
  type RoadmapTopic = { title: string; items: RoadmapItem[] };
  type RoadmapCategory = { id: string; name: string; topics: RoadmapTopic[] };

  // Tính toán tiến độ theo từng danh mục
  const calculateProgress = (category: RoadmapCategory): number => {
    const allItems = category.topics.flatMap(topic => topic.items);
    const completedItems = allItems.filter(item => item.complete);
    return (completedItems.length / allItems.length) * 100;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold gradient-heading mb-6">Lộ trình học tập toàn diện</h1>

            <Tabs defaultValue="category">
              <TabsList className="mb-6">
                <TabsTrigger value="category">Theo chủ đề</TabsTrigger>
                <TabsTrigger value="level">Theo cấp độ</TabsTrigger>
              </TabsList>

              {/* Lộ trình theo chủ đề */}
              <TabsContent value="category">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {categories.map((category) => (
                    <Card key={category.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex justify-between items-center mb-1 text-sm">
                            <span>Tiến độ</span>
                            <span>{Math.round(calculateProgress(category))}%</span>
                          </div>
                          <Progress value={calculateProgress(category)} className="h-2" />
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Accordion type="single" collapsible className="w-full">
                          {category.topics.map((topic, topicIndex) => (
                            <AccordionItem key={topicIndex} value={`topic-${category.id}-${topicIndex}`}>
                              <AccordionTrigger className="text-base py-3">{topic.title}</AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-2">
                                  {topic.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-center gap-2">
                                      {item.complete ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                      )}
                                      <span className={item.complete ? "line-through text-muted-foreground" : ""}>
                                        {item.name}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/courses?category=${category.id}`}>Xem khóa học liên quan</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Lộ trình theo cấp độ */}
              <TabsContent value="level">
                <div className="space-y-12">
                  {levelRoadmaps.map((roadmap) => (
                    <div key={roadmap.id} className="border rounded-lg p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{roadmap.title}</h2>
                          <p className="text-muted-foreground">{roadmap.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Button asChild>
                            <Link href={`/courses?level=${roadmap.id}`}>
                              Xem khóa học
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Các bước học tập</h3>
                          <ol className="space-y-3">
                            {roadmap.steps.map((step, index) => (
                              <li key={index} className="flex">
                                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Khóa học đề xuất</h3>
                          <Card>
                            <CardContent className="p-4">
                              <ul className="space-y-3">
                                {roadmap.courses.map((course, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>{course}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* CTA */}
            <section className="bg-muted rounded-lg p-8 text-center mt-12">
              <h2 className="text-2xl font-bold mb-4">Bắt đầu hành trình học tập của bạn</h2>
              <p className="mb-6 max-w-3xl mx-auto">
                Chọn lộ trình phù hợp với mục tiêu và trình độ của bạn. Chúng tôi sẽ hướng dẫn bạn
                từng bước với các bài học được thiết kế cẩn thận và dự án thực tế.  
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/courses">Khám phá khóa học</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Tư vấn học tập</Link>
                </Button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
