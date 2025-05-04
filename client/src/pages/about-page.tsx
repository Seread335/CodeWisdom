import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  const { user } = useAuth();

  // Thông tin đội ngũ sáng lập
  const founders = [
    {
      name: "Nguyễn Văn A",
      title: "Đồng sáng lập & Giảng viên",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Tiến sĩ Khoa học Máy tính tại ĐH Bách Khoa Hà Nội, 10+ năm kinh nghiệm trong ngành phát triển phần mềm và giảng dạy",
    },
    {
      name: "Trần Thị B",
      title: "Đồng sáng lập & Giám đốc nội dung",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Thạc sĩ CNTT tại ĐH Quốc gia TP.HCM, chuyên gia về an ninh mạng với hơn 8 năm kinh nghiệm trong lĩnh vực bảo mật",
    },
    {
      name: "Lê Văn C",
      title: "Giảng viên trưởng",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Kỹ sư phần mềm tại một công ty công nghệ lớn với nhiều năm kinh nghiệm phát triển các hệ thống quy mô lớn",
    },
    {
      name: "Phạm Thị D",
      title: "Chuyên gia dữ liệu",
      avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Tiến sĩ Khoa học dữ liệu tại ĐH Quốc gia TP.HCM, chuyên gia về AI và học máy với nhiều công trình nghiên cứu",
    },
  ];

  // Các lộ trình học theo mục tiêu
  const roadmaps = [
    {
      title: "Đi làm",
      description: "Lộ trình giúp bạn nhanh chóng có việc làm trong ngành IT với mức lương cạnh tranh",
      steps: [
        "Nền tảng IT & Lập trình cơ bản",
        "Chuyên sâu về một công nghệ cụ thể (Web, Mobile, AI...)",
        "Hoàn thiện các dự án thực tế",
        "Chuẩn bị CV & phỏng vấn",
      ],
    },
    {
      title: "Freelancing",
      description: "Phát triển kỹ năng để trở thành freelancer IT thành công",
      steps: [
        "Nền tảng IT & Lập trình cơ bản",
        "Học nhiều công nghệ đa dạng",
        "Xây dựng portfolio dự án",
        "Kỹ năng quản lý dự án & giao tiếp",
      ],
    },
    {
      title: "Nghiên cứu",
      description: "Định hướng cho những người muốn theo đuổi nghiên cứu và học thuật",
      steps: [
        "Nền tảng IT vững chắc",
        "Toán học nâng cao (Giải tích, Đại số, Xác suất)",
        "Chuyên sâu AI/ML/DL",
        "Phương pháp nghiên cứu & xuất bản khoa học",
      ],
    },
    {
      title: "Khởi nghiệp",
      description: "Chuẩn bị kỹ năng để khởi nghiệp trong lĩnh vực công nghệ",
      steps: [
        "Nền tảng IT & Lập trình",
        "Full-stack development",
        "Kiến thức product & business",
        "Kỹ năng lãnh đạo & quản lý team",
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Banner */}
            <div className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 mb-8 text-white">
              <h1 className="text-3xl font-bold mb-2">CodeWisdom</h1>
              <p className="text-xl mb-4">Nền tảng học lập trình toàn diện bằng tiếng Việt</p>
              <p className="mb-6">
                Sứ mệnh của chúng tôi là mang đến kiến thức công nghệ chất lượng cao bằng tiếng Việt,
                giúp người Việt Nam dễ dàng tiếp cận và làm chủ các công nghệ hiện đại.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/courses">Khám phá khóa học</Link>
              </Button>
            </div>

            {/* Đội ngũ sáng lập */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Đội ngũ sáng lập</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {founders.map((founder, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={founder.avatar} alt={founder.name} />
                          <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold text-center">{founder.name}</h3>
                        <p className="text-sm text-muted-foreground text-center">{founder.title}</p>
                      </div>
                      <p className="text-sm text-center">{founder.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Đối tượng phục vụ */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Đối tượng phục vụ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Học sinh, sinh viên</h3>
                    <p className="text-muted-foreground mb-4">
                      Giúp các bạn học sinh, sinh viên xây dựng nền tảng kiến thức vững chắc,
                      định hướng nghề nghiệp và chuẩn bị sẵn sàng cho thị trường việc làm.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Tài liệu học tập theo chương trình</li>
                      <li>Định hướng nghề nghiệp</li>
                      <li>Thực hành dự án theo nhóm</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Người trái ngành</h3>
                    <p className="text-muted-foreground mb-4">
                      Lộ trình học tập đặc biệt cho người chuyển ngành, giúp bạn nhanh chóng
                      tiếp cận kiến thức IT từ cơ bản đến chuyên sâu.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Học từ con số 0</li>
                      <li>Lộ trình tăng tốc, tập trung vào thực hành</li>
                      <li>Hỗ trợ tìm việc sau khi hoàn thành</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Lập trình viên</h3>
                    <p className="text-muted-foreground mb-4">
                      Nâng cao kỹ năng, cập nhật công nghệ mới và phát triển sự nghiệp
                      cho các lập trình viên đang làm việc trong ngành.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Các khóa học chuyên sâu theo công nghệ</li>
                      <li>Cập nhật xu hướng mới nhất</li>
                      <li>Kỹ năng architect và leadership</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Doanh nghiệp</h3>
                    <p className="text-muted-foreground mb-4">
                      Giải pháp đào tạo nhân sự công nghệ cho doanh nghiệp với chương trình
                      được thiết kế riêng theo nhu cầu.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Đào tạo theo yêu cầu doanh nghiệp</li>
                      <li>Workshop và seminar chuyên đề</li>
                      <li>Cung cấp nhân sự đã qua đào tạo</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Lộ trình đề xuất */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Lộ trình đề xuất theo mục tiêu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {roadmaps.map((roadmap, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
                      <p className="text-muted-foreground mb-4 text-sm">{roadmap.description}</p>
                      <div className="space-y-3">
                        {roadmap.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center">
                            <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs mr-3">
                              {stepIndex + 1}
                            </span>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-muted rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Sẵn sàng bắt đầu hành trình học tập?</h2>
              <p className="mb-6 max-w-3xl mx-auto">
                Cho dù bạn là người mới bắt đầu hay chuyên gia, chúng tôi đều có các khóa học phù hợp
                giúp bạn phát triển kỹ năng và đạt được mục tiêu nghề nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/roadmap">Xem lộ trình học tập</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/courses">Khám phá khóa học</Link>
                </Button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
