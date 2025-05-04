import { db } from "./index";
import * as schema from "@shared/schema";
import { eq, and, inArray, asc, desc } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting seed process...");

    // Create categories
    console.log("Creating categories...");
    const categories = [
      { name: "Lập trình web", description: "Các khóa học về phát triển web", iconName: "code" },
      { name: "Lập trình di động", description: "Các khóa học về phát triển ứng dụng di động", iconName: "smartphone" },
      { name: "Cơ sở dữ liệu", description: "Các khóa học về thiết kế và quản lý cơ sở dữ liệu", iconName: "database" },
      { name: "Mạng máy tính", description: "Các khóa học về mạng và hệ thống", iconName: "network" },
      { name: "Máy chủ", description: "Các khóa học về quản trị máy chủ", iconName: "server" },
      { name: "An ninh mạng", description: "Các khóa học về bảo mật và an ninh mạng", iconName: "shield" },
      { name: "Điện toán đám mây", description: "Các khóa học về đám mây và ảo hóa", iconName: "cloud" },
      { name: "Trí tuệ nhân tạo", description: "Các khóa học về AI và học máy", iconName: "brain" },
    ];

    for (const category of categories) {
      const existingCategory = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.name, category.name))
        .limit(1);

      if (existingCategory.length === 0) {
        await db.insert(schema.categories).values(category);
      }
    }

    // Create instructors
    console.log("Creating instructors...");
    const instructors = [
      {
        name: "Nguyễn Văn A",
        title: "Giảng viên cấp cao",
        bio: "Giảng viên với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển web và ứng dụng di động. Tốt nghiệp Thạc sĩ Khoa học Máy tính tại Đại học Bách Khoa Hà Nội.",
        courseCount: 5,
        studentCount: 1200,
        reviewScore: 5,
      },
      {
        name: "Trần Thị B",
        title: "Chuyên gia An ninh mạng",
        bio: "Chuyên gia an ninh mạng với chứng chỉ CISSP, CEH, và OSCP. Có 8 năm kinh nghiệm làm việc tại các công ty bảo mật hàng đầu Việt Nam.",
        courseCount: 3,
        studentCount: 850,
        reviewScore: 5,
      },
      {
        name: "Lê Văn C",
        title: "Kỹ sư phần mềm",
        bio: "Kỹ sư phần mềm tại một công ty công nghệ lớn với kinh nghiệm phát triển các hệ thống quy mô lớn. Chuyên về kiến trúc phần mềm và DevOps.",
        courseCount: 4,
        studentCount: 950,
        reviewScore: 5,
      },
      {
        name: "Phạm Thị D",
        title: "Chuyên gia dữ liệu",
        bio: "Chuyên gia về khoa học dữ liệu và học máy với nhiều năm kinh nghiệm trong lĩnh vực phân tích dữ liệu. Tốt nghiệp Tiến sĩ tại Đại học Quốc gia TP.HCM.",
        courseCount: 2,
        studentCount: 650,
        reviewScore: 5,
      },
    ];

    for (const instructor of instructors) {
      const existingInstructor = await db
        .select()
        .from(schema.instructors)
        .where(eq(schema.instructors.name, instructor.name))
        .limit(1);

      if (existingInstructor.length === 0) {
        await db.insert(schema.instructors).values(instructor);
      }
    }

    // Get created categories and instructors
    const createdCategories = await db.select().from(schema.categories);
    const createdInstructors = await db.select().from(schema.instructors);

    // Create courses
    console.log("Creating courses...");
    const courses = [
      {
        title: "Nhập môn lập trình với Python",
        description: "Khóa học cơ bản dành cho người mới bắt đầu học lập trình. Bạn sẽ được học các khái niệm cơ bản của lập trình thông qua ngôn ngữ Python dễ học và phổ biến.",
        imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHl0aG9uJTIwcHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D",
        level: "beginner",
        duration: "20 giờ",
        price: 0,
        enrollmentCount: 350,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "Phát triển web với JavaScript và Node.js",
        description: "Học cách xây dựng ứng dụng web hiện đại với JavaScript và Node.js. Khóa học này sẽ giới thiệu các kiến thức từ cơ bản đến nâng cao về phát triển web đầy đủ từ frontend đến backend.",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amF2YXNjcmlwdHxlbnwwfHwwfHx8MA%3D%3D",
        level: "intermediate",
        duration: "40 giờ",
        price: 299000,
        originalPrice: 399000,
        enrollmentCount: 220,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "An ninh mạng căn bản",
        description: "Tìm hiểu các nguyên tắc cơ bản về an ninh mạng, các loại tấn công phổ biến và cách bảo vệ hệ thống khỏi các mối đe dọa an ninh mạng.",
        imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3liZXIlMjBzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D",
        level: "beginner",
        duration: "25 giờ",
        price: 199000,
        originalPrice: 299000,
        enrollmentCount: 180,
        instructorId: createdInstructors[1].id,
      },
      {
        title: "Cơ sở dữ liệu SQL và NoSQL",
        description: "Khóa học toàn diện về thiết kế và quản lý cơ sở dữ liệu. Tìm hiểu cả hệ quản trị cơ sở dữ liệu quan hệ (SQL) và phi quan hệ (NoSQL).",
        imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YWJhc2V8ZW58MHx8MHx8fDA%3D",
        level: "intermediate",
        duration: "30 giờ",
        price: 249000,
        originalPrice: 349000,
        enrollmentCount: 150,
        instructorId: createdInstructors[3].id,
      },
      {
        title: "Kiến trúc vi dịch vụ (Microservices)",
        description: "Học cách thiết kế, xây dựng và triển khai các hệ thống phân tán sử dụng kiến trúc vi dịch vụ. Khóa học dành cho các kỹ sư phần mềm có kinh nghiệm muốn nâng cao kiến thức.",
        imageUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWljcm9zZXJ2aWNlc3xlbnwwfHwwfHx8MA%3D%3D",
        level: "advanced",
        duration: "35 giờ",
        price: 399000,
        originalPrice: 499000,
        enrollmentCount: 95,
        instructorId: createdInstructors[2].id,
      },
      {
        title: "Điện toán đám mây với AWS",
        description: "Tìm hiểu về dịch vụ đám mây Amazon Web Services (AWS) và cách triển khai ứng dụng trên nền tảng điện toán đám mây. Khóa học bao gồm các dịch vụ phổ biến như EC2, S3, RDS, Lambda và nhiều dịch vụ khác.",
        imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2xvdWQlMjBjb21wdXRpbmd8ZW58MHx8MHx8fDA%3D",
        level: "intermediate",
        duration: "45 giờ",
        price: 349000,
        originalPrice: 449000,
        enrollmentCount: 120,
        instructorId: createdInstructors[2].id,
      },
      // Thêm các khóa học mới dựa trên danh sách khóa học IT
      {
        title: "Tin học văn phòng toàn diện",
        description: "Khóa học toàn diện về Microsoft Office: Word, Excel, PowerPoint cho công việc văn phòng. Từ cơ bản đến các kỹ năng nâng cao giúp tăng năng suất làm việc.",
        imageUrl: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "beginner",
        duration: "25 giờ",
        price: 199000,
        enrollmentCount: 420,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "Tư duy logic và thuật toán",
        description: "Rèn luyện tư duy logic và giải thuật - nền tảng cốt lõi của lập trình. Học cách phân tích vấn đề, thiết kế giải pháp và triển khai thuật toán hiệu quả.",
        imageUrl: "https://images.unsplash.com/photo-1616628188859-7606bff85987?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "beginner",
        duration: "30 giờ",
        price: 249000,
        originalPrice: 299000,
        enrollmentCount: 280,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "HTML & CSS từ đầu",
        description: "Học cách xây dựng trang web từ nền móng với HTML và CSS. Khóa học giúp bạn hiểu cấu trúc web, các thẻ HTML, thuộc tính CSS và thiết kế responsive.",
        imageUrl: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "beginner",
        duration: "20 giờ",
        price: 0,
        enrollmentCount: 520,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "Git và GitHub cho người mới",
        description: "Làm quen với hệ thống quản lý mã nguồn Git và GitHub - công cụ cần thiết cho mọi lập trình viên. Học cách lưu trữ, quản lý và chia sẻ code một cách chuyên nghiệp.",
        imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "beginner",
        duration: "15 giờ",
        price: 199000,
        enrollmentCount: 310,
        instructorId: createdInstructors[2].id,
      },
      {
        title: "JavaScript nâng cao và ES6+",
        description: "Nâng cao kỹ năng JavaScript với các tính năng hiện đại (ES6+). Học cách tận dụng arrow functions, promises, async/await, destructuring và các tính năng mạnh mẽ khác.",
        imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "intermediate",
        duration: "25 giờ",
        price: 299000,
        originalPrice: 399000,
        enrollmentCount: 240,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "React.js từ cơ bản đến chuyên sâu",
        description: "Làm chủ thư viện React.js và xây dựng UI hiện đại. Hiểu về components, state, props, hooks và các khái niệm quan trọng để xây dựng giao diện người dùng động.",
        imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "intermediate",
        duration: "35 giờ",
        price: 349000,
        originalPrice: 449000,
        enrollmentCount: 185,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "Lập trình Java cơ bản",
        description: "Học ngôn ngữ lập trình Java và nền tảng vững chắc về lập trình hướng đối tượng (OOP). Phát triển các ứng dụng Java đa nền tảng.",
        imageUrl: "https://images.unsplash.com/photo-1588239034647-25783cbfcfc1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "beginner",
        duration: "40 giờ",
        price: 299000,
        enrollmentCount: 230,
        instructorId: createdInstructors[2].id,
      },
      {
        title: "Giải thuật và Cấu trúc dữ liệu",
        description: "Hiểu sâu về cấu trúc dữ liệu và thuật toán - nền tảng cho lập trình hiệu quả. Học cách tổ chức dữ liệu, tối ưu hóa hiệu suất và giải quyết vấn đề phức tạp.",
        imageUrl: "https://images.unsplash.com/photo-1503437313881-503a91226402?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "intermediate",
        duration: "45 giờ",
        price: 349000,
        originalPrice: 449000,
        enrollmentCount: 160,
        instructorId: createdInstructors[0].id,
      },
      {
        title: "Linux & Dòng lệnh cơ bản",
        description: "Làm quen với hệ điều hành Linux và các lệnh dòng lệnh thiết yếu. Học cách quản lý file, phân quyền, cài đặt phần mềm và các tác vụ quản trị cơ bản.",
        imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "beginner",
        duration: "20 giờ",
        price: 199000,
        enrollmentCount: 175,
        instructorId: createdInstructors[2].id,
      },
      {
        title: "Docker & Containerization",
        description: "Học cách đóng gói, triển khai và quản lý ứng dụng với Docker. Hiểu về containers, images, volumes và cách thiết lập môi trường phát triển nhất quán.",
        imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "intermediate",
        duration: "25 giờ",
        price: 299000,
        originalPrice: 399000,
        enrollmentCount: 130,
        instructorId: createdInstructors[2].id,
      },
      {
        title: "Machine Learning cơ bản với Python",
        description: "Khám phá lĩnh vực Machine Learning với Python. Học cách phân tích dữ liệu, xây dựng mô hình dự đoán và ứng dụng các thuật toán học máy vào bài toán thực tế.",
        imageUrl: "https://images.unsplash.com/photo-1655720828018-7467dbaeef92?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "intermediate",
        duration: "50 giờ",
        price: 499000,
        originalPrice: 599000,
        enrollmentCount: 115,
        instructorId: createdInstructors[3].id,
      },
      {
        title: "Ethical Hacking và Bảo mật mạng",
        description: "Học cách bảo vệ hệ thống trước các cuộc tấn công bằng cách hiểu phương pháp của hacker. Khám phá các kỹ thuật hack có đạo đức và cách phòng thủ mạng hiệu quả.",
        imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        level: "advanced",
        duration: "40 giờ",
        price: 399000,
        originalPrice: 499000,
        enrollmentCount: 90,
        instructorId: createdInstructors[1].id,
      },
    ];

    // Create courses and their categories
    for (const course of courses) {
      // Đặt giá của tất cả các khóa học thành 0 (miễn phí)
      course.price = 0;
      course.originalPrice = 0;
      
      const existingCourse = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.title, course.title))
        .limit(1);

      let courseId;
      if (existingCourse.length === 0) {
        const result = await db.insert(schema.courses).values(course).returning();
        courseId = result[0].id;
      } else {
        // Cập nhật khóa học đã tồn tại thành miễn phí
        await db
          .update(schema.courses)
          .set({ price: 0, originalPrice: 0 })
          .where(eq(schema.courses.id, existingCourse[0].id));
        courseId = existingCourse[0].id;
      }

      // Assign categories to courses
      // Each course will be assigned to 1-3 relevant categories
      const relevantCategories = getRelevantCategories(course.title, createdCategories);
      for (const categoryId of relevantCategories) {
        const existingCourseCategory = await db
          .select()
          .from(schema.courseCategories)
          .where(
            and(
              eq(schema.courseCategories.courseId, courseId),
              eq(schema.courseCategories.categoryId, categoryId)
            )
          )
          .limit(1);

        if (existingCourseCategory.length === 0) {
          await db.insert(schema.courseCategories).values({
            courseId,
            categoryId,
          });
        }
      }
    }

    // Create learning paths
    console.log("Creating learning paths...");
    const learningPaths = [
      {
        title: "Lộ trình học phát triển web",
        description: "Lộ trình toàn diện để trở thành nhà phát triển web từ cơ bản đến nâng cao.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D",
        duration: "100 giờ",
        order: 1,
      },
      {
        title: "Lộ trình học an ninh mạng",
        description: "Trở thành chuyên gia an ninh mạng với lộ trình học chi tiết từ người mới bắt đầu đến chuyên gia.",
        imageUrl: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3liZXIlMjBzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D",
        duration: "120 giờ",
        order: 2,
      },
      {
        title: "Lộ trình học điện toán đám mây",
        description: "Học cách thiết kế, triển khai và quản lý giải pháp điện toán đám mây.",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWQlMjBjb21wdXRpbmd8ZW58MHx8MHx8fDA%3D",
        duration: "90 giờ",
        order: 3,
      },
      {
        title: "Lộ trình học Machine Learning và AI",
        description: "Các khóa học về trí tuệ nhân tạo, học máy và khoa học dữ liệu từ cơ bản đến nâng cao.",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        duration: "150 giờ",
        order: 4,
      },
      {
        title: "Lộ trình học từ cơ bản đến Fullstack Developer",
        description: "Từ những bước đi đầu tiên đến kỹ năng xây dựng ứng dụng đầy đủ, phù hợp cho người mới bắt đầu học lập trình.",
        imageUrl: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        duration: "200 giờ",
        order: 5,
      },
    ];

    const createdCourses = await db.select().from(schema.courses);

    for (const path of learningPaths) {
      const existingPath = await db
        .select()
        .from(schema.learningPaths)
        .where(eq(schema.learningPaths.title, path.title))
        .limit(1);

      let pathId;
      if (existingPath.length === 0) {
        const result = await db.insert(schema.learningPaths).values(path).returning();
        pathId = result[0].id;
      } else {
        pathId = existingPath[0].id;
      }

      // Assign courses to learning paths
      const relevantCourses = getRelevantCourses(path.title, createdCourses);
      for (let i = 0; i < relevantCourses.length; i++) {
        const courseId = relevantCourses[i];
        const existingPathCourse = await db
          .select()
          .from(schema.pathCourses)
          .where(
            and(
              eq(schema.pathCourses.pathId, pathId),
              eq(schema.pathCourses.courseId, courseId)
            )
          )
          .limit(1);

        if (existingPathCourse.length === 0) {
          await db.insert(schema.pathCourses).values({
            pathId,
            courseId,
            order: i + 1,
          });
        }
      }
    }

    // Create demo user accounts
    console.log("Creating demo user accounts...");
    const users = [
      {
        username: "student",
        password: await hashPassword("password"),
        displayName: "Học Viên Demo",
        email: "student@example.com",
        role: "user",
        stats: {
          totalLearningTime: 15,
          completedCourses: 2,
          completedLessons: 28,
          certificates: 1,
        },
      },
      {
        username: "admin",
        password: await hashPassword("password"),
        displayName: "Quản Trị Viên",
        email: "admin@example.com",
        role: "admin",
      },
    ];

    for (const user of users) {
      const existingUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, user.username))
        .limit(1);

      if (existingUser.length === 0) {
        await db.insert(schema.users).values(user);
      }
    }

    // Create sample course modules and lessons for the first course
    console.log("Creating modules and lessons for the first course...");
    const firstCourse = createdCourses[0];
    if (firstCourse) {
      // Check if modules already exist
      const existingModules = await db
        .select()
        .from(schema.modules)
        .where(eq(schema.modules.courseId, firstCourse.id));

      if (existingModules.length === 0) {
        // Create modules
        const modules = [
          {
            courseId: firstCourse.id,
            title: "Giới thiệu về lập trình",
            description: "Hiểu về cơ bản về lập trình và ngôn ngữ Python",
            order: 1,
          },
          {
            courseId: firstCourse.id,
            title: "Cấu trúc dữ liệu và biến",
            description: "Tìm hiểu về các loại dữ liệu và biến trong Python",
            order: 2,
          },
          {
            courseId: firstCourse.id,
            title: "Cấu trúc điều khiển",
            description: "Học về các cấu trúc điều khiển như if-else, vòng lặp",
            order: 3,
          },
        ];

        // Create modules and their lessons
        for (const module of modules) {
          const result = await db.insert(schema.modules).values(module).returning();
          const moduleId = result[0].id;

          // Create lessons for each module
          const lessons = [];
          if (module.order === 1) {
            lessons.push(
              {
                moduleId,
                title: "Lập trình là gì?",
                description: "Giới thiệu về lập trình và tầm quan trọng của nó",
                type: "video",
                content: {
                  sections: [
                    {
                      type: "paragraph",
                      content: "Lập trình là quá trình tạo ra một tập hợp các hướng dẫn cho máy tính thực hiện. Các hướng dẫn này được gọi là mã nguồn và được viết bằng các ngôn ngữ lập trình như Python, JavaScript, C++, vv."
                    },
                    {
                      type: "paragraph",
                      content: "Lập trình viên sử dụng ngôn ngữ lập trình để giao tiếp với máy tính và yêu cầu máy tính thực hiện các nhiệm vụ cụ thể."
                    },
                    {
                      type: "heading",
                      title: "Tại sao lập trình quan trọng?"
                    },
                    {
                      type: "list",
                      items: [
                        "Lập trình giúp tự động hóa các tác vụ lặp đi lặp lại",
                        "Giải quyết các vấn đề phức tạp một cách hiệu quả",
                        "Xây dựng phần mềm và ứng dụng đáp ứng nhu cầu của người dùng",
                        "Phát triển kỹ năng tư duy logic và giải quyết vấn đề"
                      ]
                    }
                  ]
                },
                videoUrl: "https://www.youtube.com/embed/videos",
                duration: "00:15:30",
                order: 1,
                isPreview: true,
              },
              {
                moduleId,
                title: "Cài đặt Python và môi trường phát triển",
                description: "Hướng dẫn cài đặt Python và các công cụ cần thiết",
                type: "text",
                content: {
                  sections: [
                    {
                      type: "heading",
                      title: "Cài đặt Python"
                    },
                    {
                      type: "paragraph",
                      content: "Để bắt đầu lập trình với Python, bạn cần cài đặt Python trên máy tính của mình. Python có sẵn cho tất cả các hệ điều hành chính: Windows, macOS và Linux."
                    },
                    {
                      type: "subheading",
                      title: "Cài đặt trên Windows"
                    },
                    {
                      type: "list",
                      items: [
                        "Truy cập website chính thức của Python tại python.org",
                        "Tải về phiên bản Python mới nhất cho Windows",
                        "Chạy file cài đặt và đảm bảo chọn 'Add Python to PATH'",
                        "Hoàn tất quá trình cài đặt"
                      ]
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Kiểm tra Python đã cài đặt thành công\nprint('Hello, World!')"
                    }
                  ]
                },
                order: 2,
              },
            );
          } else if (module.order === 2) {
            lessons.push(
              {
                moduleId,
                title: "Biến và kiểu dữ liệu trong Python",
                description: "Tìm hiểu về biến và các kiểu dữ liệu cơ bản",
                type: "video",
                content: {
                  sections: [
                    {
                      type: "paragraph",
                      content: "Trong Python, biến là nơi lưu trữ giá trị. Không giống như nhiều ngôn ngữ lập trình khác, Python không yêu cầu khai báo kiểu dữ liệu khi tạo biến."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Tạo biến trong Python\nx = 10        # Biến số nguyên\nname = 'Python'  # Biến chuỗi\nis_active = True  # Biến boolean\n\nprint(type(x))       # <class 'int'>\nprint(type(name))    # <class 'str'>\nprint(type(is_active))  # <class 'bool'>"
                    },
                    {
                      type: "heading",
                      title: "Các kiểu dữ liệu cơ bản trong Python"
                    },
                    {
                      type: "list",
                      items: [
                        "Số nguyên (int): 1, 2, 3, ...",
                        "Số thực (float): 1.0, 2.5, 3.14, ...",
                        "Chuỗi (str): 'Hello', \"Python\", ...",
                        "Boolean (bool): True, False",
                        "None: Biểu thị không có giá trị"
                      ]
                    }
                  ]
                },
                videoUrl: "https://www.youtube.com/embed/videos",
                duration: "00:20:15",
                order: 1,
              },
              {
                moduleId,
                title: "Cấu trúc dữ liệu trong Python",
                description: "Học về các cấu trúc dữ liệu như danh sách, từ điển và tập hợp",
                type: "text",
                content: {
                  sections: [
                    {
                      type: "heading",
                      title: "Cấu trúc dữ liệu trong Python"
                    },
                    {
                      type: "paragraph",
                      content: "Python có nhiều cấu trúc dữ liệu tích hợp giúp lưu trữ và tổ chức dữ liệu một cách hiệu quả. Dưới đây là một số cấu trúc dữ liệu phổ biến."
                    },
                    {
                      type: "subheading",
                      title: "Danh sách (List)"
                    },
                    {
                      type: "paragraph",
                      content: "Danh sách là một tập hợp các mục được sắp xếp theo thứ tự. Danh sách có thể chứa các mục thuộc các kiểu dữ liệu khác nhau và có thể thay đổi (mutable)."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Tạo và sử dụng danh sách\nfruits = ['apple', 'banana', 'orange']\nprint(fruits[0])  # apple\n\n# Thêm phần tử vào danh sách\nfruits.append('grape')\nprint(fruits)  # ['apple', 'banana', 'orange', 'grape']"
                    },
                    {
                      type: "subheading",
                      title: "Từ điển (Dictionary)"
                    },
                    {
                      type: "paragraph",
                      content: "Từ điển lưu trữ dữ liệu theo cặp khóa-giá trị. Mỗi khóa phải là duy nhất và không thể thay đổi."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Tạo và sử dụng từ điển\nperson = {\n    'name': 'John',\n    'age': 30,\n    'is_student': False\n}\n\nprint(person['name'])  # John\n\n# Thêm cặp khóa-giá trị mới\nperson['city'] = 'New York'\nprint(person)  # {'name': 'John', 'age': 30, 'is_student': False, 'city': 'New York'}"
                    }
                  ]
                },
                order: 2,
              },
            );
          } else if (module.order === 3) {
            lessons.push(
              {
                moduleId,
                title: "Câu lệnh điều kiện if-else",
                description: "Học cách sử dụng câu lệnh if-else trong Python",
                type: "video",
                content: {
                  sections: [
                    {
                      type: "heading",
                      title: "Câu lệnh điều kiện trong Python"
                    },
                    {
                      type: "paragraph",
                      content: "Câu lệnh điều kiện cho phép chương trình đưa ra quyết định dựa trên điều kiện. Python hỗ trợ câu lệnh điều kiện thông qua if, elif và else."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Cấu trúc câu lệnh if-else\nx = 10\n\nif x > 0:\n    print('x là số dương')\nelif x < 0:\n    print('x là số âm')\nelse:\n    print('x bằng 0')"
                    },
                    {
                      type: "note",
                      content: "Lưu ý rằng Python sử dụng thụt lề (indentation) để xác định phạm vi của các khối lệnh. Đây là một điểm khác biệt so với nhiều ngôn ngữ lập trình khác sử dụng dấu ngoặc nhọn {}."
                    }
                  ]
                },
                videoUrl: "https://www.youtube.com/embed/videos",
                duration: "00:18:45",
                order: 1,
              },
              {
                moduleId,
                title: "Vòng lặp trong Python",
                description: "Tìm hiểu về vòng lặp for và while",
                type: "text",
                content: {
                  sections: [
                    {
                      type: "heading",
                      title: "Vòng lặp trong Python"
                    },
                    {
                      type: "paragraph",
                      content: "Vòng lặp cho phép thực thi một khối lệnh nhiều lần. Python có hai loại vòng lặp chính: for và while."
                    },
                    {
                      type: "subheading",
                      title: "Vòng lặp for"
                    },
                    {
                      type: "paragraph",
                      content: "Vòng lặp for được sử dụng để lặp qua một chuỗi (như danh sách, tuple, từ điển, tập hợp hoặc chuỗi)."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Vòng lặp for cơ bản\nfruits = ['apple', 'banana', 'orange']\n\nfor fruit in fruits:\n    print(fruit)\n\n# Sử dụng range()\nfor i in range(5):\n    print(i)  # In ra 0, 1, 2, 3, 4"
                    },
                    {
                      type: "subheading",
                      title: "Vòng lặp while"
                    },
                    {
                      type: "paragraph",
                      content: "Vòng lặp while thực thi một khối lệnh miễn là điều kiện được đánh giá là True."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Vòng lặp while cơ bản\ncount = 0\n\nwhile count < 5:\n    print(count)\n    count += 1  # Tăng count lên 1\n\n# Lưu ý: Vòng lặp while có thể vô hạn nếu điều kiện luôn True\n# Đảm bảo điều kiện sẽ trở thành False tại một thời điểm nào đó"
                    },
                    {
                      type: "warning",
                      content: "Cẩn thận với vòng lặp vô hạn! Luôn đảm bảo rằng có một điều kiện dừng để thoát khỏi vòng lặp while."
                    }
                  ]
                },
                order: 2,
              },
              {
                moduleId,
                title: "Bài tập thực hành",
                description: "Làm bài tập để củng cố kiến thức",
                type: "exercise",
                content: {
                  sections: [
                    {
                      type: "heading",
                      title: "Bài tập thực hành"
                    },
                    {
                      type: "paragraph",
                      content: "Hãy làm các bài tập sau để kiểm tra kiến thức của bạn về điều kiện và vòng lặp trong Python."
                    },
                    {
                      type: "subheading",
                      title: "Bài 1: Kiểm tra số chẵn lẻ"
                    },
                    {
                      type: "paragraph",
                      content: "Viết một chương trình nhận vào một số từ người dùng và kiểm tra xem đó là số chẵn hay số lẻ."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Code mẫu\nnum = int(input('Nhập một số: '))\n\n# Viết code của bạn ở đây\n# ..."
                    },
                    {
                      type: "subheading",
                      title: "Bài 2: Tính tổng các số từ 1 đến n"
                    },
                    {
                      type: "paragraph",
                      content: "Viết chương trình tính tổng các số từ 1 đến n, với n là số nguyên dương nhập từ người dùng."
                    },
                    {
                      type: "code",
                      language: "python",
                      content: "# Code mẫu\nn = int(input('Nhập số n: '))\n\n# Viết code của bạn ở đây\n# ..."
                    }
                  ]
                },
                order: 3,
              },
            );
          }

          if (lessons.length > 0) {
            for (const lesson of lessons) {
              await db.insert(schema.lessons).values(lesson);
            }
          }
        }
      }
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Helper function to determine relevant categories for a course
function getRelevantCategories(courseTitle: string, categories: any[]): number[] {
  const title = courseTitle.toLowerCase();
  const categoryIds: number[] = [];

  // Lập trình web
  if (title.includes("python") || title.includes("javascript") || title.includes("lập trình") ||
      title.includes("web") || title.includes("html") || title.includes("css") ||
      title.includes("node.js") || title.includes("react")) {
    const webCat = categories.find(c => c.name.includes("Lập trình web"));
    if (webCat) categoryIds.push(webCat.id);
  }

  // Lập trình di động
  if (title.includes("mobile") || title.includes("di động") || title.includes("android") ||
      title.includes("ios") || title.includes("flutter") || title.includes("react native")) {
    const mobileCat = categories.find(c => c.name.includes("Lập trình di động"));
    if (mobileCat) categoryIds.push(mobileCat.id);
  }

  // Cơ sở dữ liệu
  if (title.includes("cơ sở dữ liệu") || title.includes("sql") || title.includes("nosql") ||
      title.includes("database") || title.includes("postgresql") || title.includes("mongodb")) {
    const dbCat = categories.find(c => c.name.includes("Cơ sở dữ liệu"));
    if (dbCat) categoryIds.push(dbCat.id);
  }

  // An ninh mạng
  if (title.includes("an ninh") || title.includes("bảo mật") || title.includes("security") ||
      title.includes("hacking") || title.includes("ethical")) {
    const securityCat = categories.find(c => c.name.includes("An ninh mạng"));
    if (securityCat) categoryIds.push(securityCat.id);
  }

  // Máy chủ
  if (title.includes("máy chủ") || title.includes("server") || title.includes("vi dịch vụ") ||
      title.includes("microservices") || title.includes("docker") || title.includes("containerization")) {
    const serverCat = categories.find(c => c.name.includes("Máy chủ"));
    if (serverCat) categoryIds.push(serverCat.id);
  }

  // Điện toán đám mây
  if (title.includes("đám mây") || title.includes("aws") || title.includes("cloud") ||
      title.includes("azure") || title.includes("gcp")) {
    const cloudCat = categories.find(c => c.name.includes("Điện toán đám mây"));
    if (cloudCat) categoryIds.push(cloudCat.id);
  }

  // Trí tuệ nhân tạo
  if (title.includes("trí tuệ nhân tạo") || title.includes("ai") || title.includes("machine learning") ||
      title.includes("deep learning") || title.includes("data science")) {
    const aiCat = categories.find(c => c.name.includes("Trí tuệ nhân tạo"));
    if (aiCat) categoryIds.push(aiCat.id);
  }

  // Mạng máy tính
  if (title.includes("mạng") || title.includes("network") || title.includes("tcp/ip") ||
      title.includes("linux") || title.includes("dòng lệnh")) {
    const networkCat = categories.find(c => c.name.includes("Mạng máy tính"));
    if (networkCat) categoryIds.push(networkCat.id);
  }

  // Văn phòng
  if (title.includes("văn phòng") || title.includes("office") || title.includes("word") ||
      title.includes("excel") || title.includes("powerpoint")) {
    // Gạ vào danh mục Cơ sở dữ liệu vì không có danh mục văn phòng
    const dbCat = categories.find(c => c.name.includes("Cơ sở dữ liệu"));
    if (dbCat) categoryIds.push(dbCat.id);
  }

  // If no specific categories matched, use a default category
  if (categoryIds.length === 0 && categories.length > 0) {
    categoryIds.push(categories[0].id);
  }

  return categoryIds;
}

// Helper function to determine relevant courses for a learning path
function getRelevantCourses(pathTitle: string, courses: any[]): number[] {
  const title = pathTitle.toLowerCase();
  const courseIds: number[] = [];

  if (title.includes("phát triển web")) {
    const webCourses = courses.filter(c => {
      const courseTitle = c.title.toLowerCase();
      return courseTitle.includes("web") || 
        courseTitle.includes("javascript") ||
        courseTitle.includes("python") ||
        courseTitle.includes("html") ||
        courseTitle.includes("css") ||
        courseTitle.includes("react") ||
        courseTitle.includes("node");
    });
    
    // Limit to max 5 courses per path
    const limitedCourses = webCourses.slice(0, 5);
    courseIds.push(...limitedCourses.map(c => c.id));
  }

  if (title.includes("an ninh mạng")) {
    const securityCourses = courses.filter(c => {
      const courseTitle = c.title.toLowerCase();
      return courseTitle.includes("an ninh") || 
        courseTitle.includes("bảo mật") ||
        courseTitle.includes("security") ||
        courseTitle.includes("hacking") ||
        courseTitle.includes("ethical");
    });
    
    // Limit to max 5 courses per path
    const limitedCourses = securityCourses.slice(0, 5);
    courseIds.push(...limitedCourses.map(c => c.id));
  }

  if (title.includes("điện toán đám mây")) {
    const cloudCourses = courses.filter(c => {
      const courseTitle = c.title.toLowerCase();
      return courseTitle.includes("đám mây") || 
        courseTitle.includes("aws") ||
        courseTitle.includes("cloud") ||
        courseTitle.includes("azure") ||
        courseTitle.includes("docker") ||
        courseTitle.includes("containerization");
    });
    
    // Limit to max 5 courses per path
    const limitedCourses = cloudCourses.slice(0, 5);
    courseIds.push(...limitedCourses.map(c => c.id));
  }

  // If no specific courses matched, use the first 2-3 courses
  if (courseIds.length === 0 && courses.length > 0) {
    const limit = Math.min(3, courses.length);
    for (let i = 0; i < limit; i++) {
      courseIds.push(courses[i].id);
    }
  }

  return courseIds;
}

seed();
