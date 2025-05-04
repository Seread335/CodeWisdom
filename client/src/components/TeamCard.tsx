export interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  image: string;
  socials: {
    linkedin?: string;
    github?: string;
    facebook?: string;
    twitter?: string;
    medium?: string;
  };
  borderColor: string;
}

export default function TeamCard({
  name,
  role,
  description,
  image,
  socials,
  borderColor
}: TeamMemberProps) {
  
  const getBorderColor = () => {
    switch (borderColor) {
      case "primary":
        return "border-primary";
      case "secondary":
        return "border-secondary";
      case "accent":
        return "border-accent";
      default:
        return "border-primary";
    }
  };

  const getTextColor = () => {
    switch (borderColor) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      case "accent":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="bg-light p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className={`w-32 h-32 rounded-full overflow-hidden mb-4 border-4 ${getBorderColor()}`}>
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className={`${getTextColor()} font-medium mb-2`}>{role}</p>
        <p className="text-gray-600 text-center mb-4">{description}</p>
        <div className="flex space-x-3">
          {socials.linkedin && (
            <a href={socials.linkedin} className="text-gray-500 hover:text-primary">
              <i className="fab fa-linkedin"></i>
            </a>
          )}
          {socials.github && (
            <a href={socials.github} className="text-gray-500 hover:text-primary">
              <i className="fab fa-github"></i>
            </a>
          )}
          {socials.facebook && (
            <a href={socials.facebook} className="text-gray-500 hover:text-primary">
              <i className="fab fa-facebook"></i>
            </a>
          )}
          {socials.twitter && (
            <a href={socials.twitter} className="text-gray-500 hover:text-primary">
              <i className="fab fa-twitter"></i>
            </a>
          )}
          {socials.medium && (
            <a href={socials.medium} className="text-gray-500 hover:text-primary">
              <i className="fab fa-medium"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
