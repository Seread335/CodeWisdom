export interface RoadmapProps {
  title: string;
  description: string;
  level: string;
  category: string;
  skills: string[];
}

export default function RoadmapCard({
  title,
  description,
  level,
  category,
  skills
}: RoadmapProps) {
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-beginner";
      case "Intermediate":
        return "bg-intermediate";
      case "Advanced":
        return "bg-advanced";
      case "Expert":
        return "bg-expert";
      default:
        return "bg-beginner";
    }
  };

  const getLevelClass = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-beginner h-2";
      case "Intermediate":
        return "bg-intermediate h-2";
      case "Advanced":
        return "bg-advanced h-2";
      case "Expert":
        return "bg-expert h-2";
      default:
        return "bg-beginner h-2";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={getLevelClass(level)}></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className={`${getLevelColor(level)} text-white text-xs px-2 py-1 rounded-full`}>
            {level}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="mb-6 space-y-2">
          {skills.map((skill, index) => (
            <li key={index} className="flex items-center">
              <i className={`fas fa-check-circle ${getLevelColor(level).replace('bg-', 'text-')} mr-2`}></i> 
              {skill}
            </li>
          ))}
        </ul>
        <a href="#" className="block text-center bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Xem lộ trình
        </a>
      </div>
    </div>
  );
}
