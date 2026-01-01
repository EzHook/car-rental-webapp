import Image from 'next/image';

interface HeroCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  carImage: string;
  backgroundGradient?: string;
  buttonColor?: string;
}

export default function HeroCard({
  title,
  description,
  buttonText,
  onButtonClick,
  carImage,
  backgroundGradient = 'from-[#54a6ff] to-[#1e3a8a]',
  buttonColor = 'bg-[#3563e9] hover:bg-[#264ac6]',
}: HeroCardProps) {
  return (
    <div 
      className={`relative bg-linear-to-br ${backgroundGradient} rounded-xl overflow-hidden p-6 lg:p-8 min-h-90 flex flex-col justify-between`}
    >
      {/* Content Section */}
      <div className="relative z-10 max-w-md">
        <h2 className="text-white text-3xl lg:text-4xl font-semibold leading-tight mb-4">
          {title}
        </h2>
        <p className="text-white/90 text-sm lg:text-base leading-relaxed mb-6">
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className={`${buttonColor} text-white px-6 py-3 rounded-md font-semibold text-sm transition-colors duration-200 hover:shadow-lg`}
        >
          {buttonText}
        </button>
      </div>

      {/* Car Image */}
      <div className="absolute bottom-0 right-0 w-[50%] lg:w-[55%] h-full">
        <div className="relative w-full h-full">
          <Image
            src={carImage}
            alt={title}
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  );
}
