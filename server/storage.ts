import { 
  User, InsertUser, users,
  Course, InsertCourse, courses,
  Roadmap, InsertRoadmap, roadmaps,
  Subscription, InsertSubscription, subscriptions,
  ContactMessage, InsertContactMessage, contactMessages
} from "@shared/schema";

// Extend the storage interface with the necessary CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Roadmap operations
  getAllRoadmaps(): Promise<Roadmap[]>;
  getRoadmapById(id: number): Promise<Roadmap | undefined>;
  getRoadmapsByCategory(category: string): Promise<Roadmap[]>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  
  // Subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private roadmaps: Map<number, Roadmap>;
  private subscriptions: Map<number, Subscription>;
  private contactMessages: Map<number, ContactMessage>;
  
  private currentUserId: number;
  private currentCourseId: number;
  private currentRoadmapId: number;
  private currentSubscriptionId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.roadmaps = new Map();
    this.subscriptions = new Map();
    this.contactMessages = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentRoadmapId = 1;
    this.currentSubscriptionId = 1;
    this.currentContactMessageId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample courses (from the data.ts content)
    const sampleCourses: InsertCourse[] = [
      {
        title: "Lập trình Web cơ bản",
        description: "HTML, CSS và JavaScript cho người mới bắt đầu. Tạo trang web đầu tiên từ con số 0.",
        level: "Beginner",
        duration: "24 giờ",
        price: "Miễn phí",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
        category: "beginner-courses"
      },
      {
        title: "Python for Data Science",
        description: "Phân tích dữ liệu với Python. Numpy, Pandas, Matplotlib và các thư viện phân tích dữ liệu.",
        level: "Intermediate",
        duration: "36 giờ",
        price: "1,499,000 VNĐ",
        image: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
        category: "ai-courses"
      }
    ];
    
    // Add sample roadmaps
    const sampleRoadmaps: InsertRoadmap[] = [
      {
        title: "Lập trình viên Web",
        description: "Lộ trình toàn diện để trở thành lập trình viên Web Frontend, Backend hoặc Fullstack.",
        level: "Beginner",
        category: "beginners",
        skills: [
          "HTML, CSS, JavaScript",
          "React / Vue.js",
          "Node.js / Express",
          "SQL & NoSQL"
        ]
      },
      {
        title: "Data Science",
        description: "Khám phá dữ liệu, xây dựng mô hình và trực quan hóa kết quả.",
        level: "Intermediate",
        category: "career",
        skills: [
          "Python cơ bản & nâng cao",
          "Numpy, Pandas, Matplotlib",
          "Machine Learning",
          "SQL & Database"
        ]
      }
    ];
    
    // Add the sample data to the maps
    sampleCourses.forEach(course => this.createCourse(course));
    sampleRoadmaps.forEach(roadmap => this.createRoadmap(roadmap));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      course => course.category === category
    );
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const createdAt = new Date();
    const course: Course = { ...insertCourse, id, createdAt };
    this.courses.set(id, course);
    return course;
  }
  
  // Roadmap operations
  async getAllRoadmaps(): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values());
  }
  
  async getRoadmapById(id: number): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }
  
  async getRoadmapsByCategory(category: string): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values()).filter(
      roadmap => roadmap.category === category
    );
  }
  
  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const id = this.currentRoadmapId++;
    const createdAt = new Date();
    const roadmap: Roadmap = { ...insertRoadmap, id, createdAt };
    this.roadmaps.set(id, roadmap);
    return roadmap;
  }
  
  // Subscription operations
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const createdAt = new Date();
    const subscription: Subscription = { ...insertSubscription, id, createdAt };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  // Contact message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const createdAt = new Date();
    const message: ContactMessage = { ...insertMessage, id, createdAt };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
