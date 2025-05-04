export interface CourseProps {
  image: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  price: string;
  category: string;
}

export default function CourseCard({
  image,
  title,
  description,
  level,
  duration,
  price,
  category
}: CourseProps) {
  
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`${getLevelColor(level)} text-white text-xs px-2 py-1 rounded-full`}>
            {level}
          </span>
          <span className="text-gray-500 text-sm"><i className="far fa-clock mr-1"></i> {duration}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary">{price}</span>
          <a href="#" className="text-white bg-primary px-4 py-2 rounded hover:bg-blue-600 transition">
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  );
}
