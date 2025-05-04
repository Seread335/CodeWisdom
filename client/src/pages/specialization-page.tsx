import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Code, Database, ShieldCheck, Monitor, Smartphone, BrainCircuit, LineChart, Beaker, Gamepad2, Blocks } from "lucide-react";

export default function SpecializationPage() {
  const { user } = useAuth();

  // Danh sách các chuyên ngành trong IT
  const specializations = [
    {
      id: "web",
      name: "Phát triển Web",
      icon: <Code className="h-8 w-8 mb-4 text-primary" />,
      description: "Trở thành chuyên gia phát triển web với các kỹ năng frontend và backend",
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Database"],
      career: "Frontend/Backend/Full-stack Developer",
      courseCount: 15,
      studentCount: 1250,
    },
    {
      id: "mobile",
      name: "Phát triển Ứng dụng di động",
      icon: <Smartphone className="h-8 w-8 mb-4 text-primary" />,
      description: "Xây dựng ứng dụng di động cho Android, iOS hoặc cross-platform",
      skills: ["React Native", "Flutter", "Android/Kotlin", "iOS/Swift"],
      career: "Mobile App Developer",
      courseCount: 8,
      studentCount: 650,
    },
    {
      id: "ai-ml",
      name: "Trí tuệ nhân tạo & ML",
      icon: <BrainCircuit className="h-8 w-8 mb-4 text-primary" />,
      description: "Nắm vững kỹ thuật machine learning, deep learning và AI",
      skills: ["Python", "Data Science", "TensorFlow/PyTorch", "Computer Vision", "NLP"],
      career: "AI Engineer, ML Engineer, Data Scientist",
      courseCount: 12,
      studentCount: 480,
    },
    {
      id: "data-science",
      name: "Data Science & Big Data",
      icon: <LineChart className="h-8 w-8 mb-4 text-primary" />,
      description: "Phân tích dữ liệu và tối ưu hóa quyết định dựa trên dữ liệu",
      skills: ["Python", "SQL", "Big Data Tools", "Data Visualization", "Statistics"],
      career: "Data Analyst, Data Engineer, Business Intelligence",
      courseCount: 10,
      studentCount: 420,
    },
    {
      id: "cybersecurity",
      name: "An ninh mạng",
      icon: <ShieldCheck className="h-8 w-8 mb-4 text-primary" />,
      description: "Bảo vệ hệ thống khỏi các mối đe dọa và tấn công mạng",
      skills: ["Network Security", "Ethical Hacking", "Cryptography", "Security Tools"],
      career: "Security Analyst, Penetration Tester, Security Engineer",
      courseCount: 9,
      studentCount: 350,
    },
    {
      id: "testing",
      name: "Kiểm thử phần mềm",
      icon: <Beaker className="h-8 w-8 mb-4 text-primary" />,
      description: "Đảm bảo chất lượng phần mềm với các phương pháp kiểm thử hiện đại",
      skills: ["Manual Testing", "Automation Testing", "Selenium", "Postman", "CI/CD"],
      career: "QA Engineer, Test Automation Engineer",
      courseCount: 6,
      studentCount: 280,
    },
    {
      id: "devops",
      name: "DevOps & Cloud",
      icon: <Monitor className="h-8 w-8 mb-4 text-primary" />,
      description: "Triển khai và quản lý hệ thống trên các nền tảng cloud hiện đại",
      skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS/GCP/Azure"],
      career: "DevOps Engineer, Cloud Engineer, SRE",
      courseCount: 8,
      studentCount: 320,
    },
    {
      id: "game",
      name: "Phát triển Game",
      icon: <Gamepad2 className="h-8 w-8 mb-4 text-primary" />,
      description: "Thiết kế và phát triển game với các công cụ hiện đại như Unity, Unreal",
      skills: ["C#", "Unity", "C++", "Unreal Engine", "Game Design"],
      career: "Game Developer, Game Designer",
      courseCount: 7,
      studentCount: 190,
    },
    {
      id: "blockchain",
      name: "Blockchain & Web3",
      icon: <Blocks className="h-8 w-8 mb-4 text-primary" />,
      description: "Phát triển ứng dụng phi tập trung và smart contracts",
      skills: ["Solidity", "Web3.js", "Smart Contracts", "DApps", "Tokenomics"],
      career: "Blockchain Developer, Smart Contract Developer",
      courseCount: 5,
      studentCount: 150,
    },
    {
      id: "database",
      name: "Cơ sở dữ liệu",
      icon: <Database className="h-8 w-8 mb-4 text-primary" />,
      description: "Thiết kế và quản lý hệ thống cơ sở dữ liệu hiệu quả",
      skills: ["SQL", "NoSQL", "Database Design", "Data Modeling", "Performance Tuning"],
      career: "Database Administrator, Database Developer",
      courseCount: 7,
      studentCount: 310,
    },
    {
      id: "erp",
      name: "Phần mềm doanh nghiệp",
      icon: <BookOpen className="h-8 w-8 mb-4 text-primary" />,
      description: "Phát triển và triển khai các hệ thống ERP, CRM cho doanh nghiệp",
      skills: ["ERP Systems", "CRM", "Business Analysis", "Integration"],
      career: "ERP Consultant, Business Analyst",
      courseCount: 6,
      studentCount: 220,
    },
  ];

  // Nội dung chi tiết cho tab theo chuyên ngành web dev
  const webDevContent = {
    intro: `Phát triển web là lĩnh vực rộng lớn với nhiều chuyên môn khác nhau, bao gồm frontend (phần người dùng nhìn thấy), backend (xử lý logic server), và fullstack (kết hợp cả hai).`,
    tracks: [
      {
        name: "Frontend Development",
        description: "Chuyên về phát triển giao diện người dùng và trải nghiệm tương tác",
        content: [
          { title: "Cơ bản", items: ["HTML5", "CSS3", "JavaScript cơ bản", "Responsive Design"] },
          { title: "Framework", items: ["React.js", "Vue.js", "Angular"] },
          { title: "Advanced", items: ["State Management", "Performance Optimization", "Testing"] },
        ],
        careers: ["Frontend Developer", "UI Developer", "React Developer"],
      },
      {
        name: "Backend Development",
        description: "Tập trung vào xử lý logic server, cơ sở dữ liệu, và API",
        content: [
          { title: "Cơ bản", items: ["Node.js", "Express", "RESTful APIs", "Authentication"] },
          { title: "Database", items: ["SQL (MySQL, PostgreSQL)", "NoSQL (MongoDB)", "ORM/ODM"] },
          { title: "Advanced", items: ["Microservices", "GraphQL", "Caching", "Security"] },
        ],
        careers: ["Backend Developer", "API Developer", "Node.js Developer"],
      },
      {
        name: "Full-stack Development",
        description: "Kết hợp kỹ năng frontend và backend để có thể phát triển toàn bộ ứng dụng",
        content: [
          { title: "Frontend + Backend", items: ["Tất cả kỹ năng trên"] },
          { title: "DevOps Basics", items: ["Deployment", "CI/CD", "Docker cơ bản"] },
          { title: "Project Skills", items: ["System Design", "Performance Optimization", "Security"] },
        ],
        careers: ["Full-stack Developer", "Web Application Developer", "Software Engineer"],
      },
    ],
    courses: [
      { name: "HTML & CSS cho người mới bắt đầu", level: "beginner" },
      { name: "JavaScript cơ bản và nâng cao", level: "beginner" },
      { name: "Xây dựng website responsive", level: "beginner" },
      { name: "Mách bạn cách phát triển hệ thống với Node.js", level: "intermediate" },
      { name: "Frontend chuyên sâu với React.js", level: "intermediate" },
      { name: "RESTful API với Express", level: "intermediate" },
      { name: "Advanced React: Performance & Patterns", level: "advanced" },
    ],
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold gradient-heading mb-6">Học theo chuyên ngành</h1>
            <p className="text-muted-foreground mb-8">
              Khám phá các lĩnh vực chuyên môn trong ngành IT và lựa chọn con đường phát triển
              sự nghiệp phù hợp với sở thích và đam mê của bạn.
            </p>

            {/* Danh sách các chuyên ngành */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {specializations.map((specialization) => (
                <Card key={specialization.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-center">
                      {specialization.icon}
                    </div>
                    <CardTitle className="text-center">{specialization.name}</CardTitle>
                    <CardDescription className="text-center">
                      {specialization.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Kỹ năng chính:</p>
                      <div className="flex flex-wrap gap-2">
                        {specialization.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Cơ hội nghề nghiệp:</p>
                      <p className="text-sm text-muted-foreground">{specialization.career}</p>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground pt-2">
                      <span>{specialization.courseCount} khóa học</span>
                      <span>{specialization.studentCount.toLocaleString()} học viên</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="default" className="w-full" asChild>
                      <Link href={`/courses?specialization=${specialization.id}`}>
                        Khám phá <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Thông tin chi tiết lộ trình Web Development */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Code className="mr-2 h-6 w-6" />
                Thông tin lộ trình: Phát triển Web
              </h2>
              <p className="text-muted-foreground mb-8">{webDevContent.intro}</p>

              <Tabs defaultValue="frontend">
                <TabsList className="mb-6">
                  {webDevContent.tracks.map((track) => (
                    <TabsTrigger key={track.name} value={track.name.toLowerCase().split(' ')[0]}>
                      {track.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {webDevContent.tracks.map((track) => (
                  <TabsContent key={track.name} value={track.name.toLowerCase().split(' ')[0]}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{track.name}</CardTitle>
                        <CardDescription>{track.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {track.content.map((section, idx) => (
                            <div key={idx}>
                              <h3 className="font-semibold mb-3">{section.title}</h3>
                              <ul className="space-y-1">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                    <span className="text-sm">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <h3 className="font-semibold mb-3">Cơ hội nghề nghiệp:</h3>
                          <div className="flex flex-wrap gap-2">
                            {track.careers.map((career, idx) => (
                              <Badge key={idx} variant="outline">{career}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link href={`/courses?track=${track.name.toLowerCase().replace(' ', '-')}`}>
                            Xem khóa học {track.name}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Khóa học đề xuất cho lộ trình Web</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {webDevContent.courses.map((course, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium mb-1">{course.name}</h4>
                            <Badge variant={course.level === "beginner" ? "secondary" : course.level === "intermediate" ? "default" : "outline"}>
                              {course.level === "beginner" ? "Cơ bản" : course.level === "intermediate" ? "Trung cấp" : "Nâng cao"}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                            <Link href={`/courses/${course.name.toLowerCase().replace(/ /g, '-')}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/courses?specialization=web">
                      Xem tất cả khóa học Web Development
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
