import { FaStar } from "react-icons/fa";

function Rating({ rating ,className,size=20}: { rating: number,className?: string,size?: number }) {
  return (
    <div className={`${className} flex items-center gap-2`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar className={`${index < rating ? " text-primary" : "text-gray-400"}  text-[${size}px]`} key={index.toString()} />
      ))}
    </div>
  );
}

export default Rating;
