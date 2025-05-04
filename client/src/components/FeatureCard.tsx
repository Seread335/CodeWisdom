export interface FeatureProps {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  iconBgColor: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  bgColor,
  iconBgColor
}: FeatureProps) {
  return (
    <div className={`${bgColor} p-6 rounded-lg flex flex-col items-center text-center`}>
      <div className={`${iconBgColor} p-3 rounded-full mb-4 text-white`}>
        <i className={`${icon} text-2xl`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
