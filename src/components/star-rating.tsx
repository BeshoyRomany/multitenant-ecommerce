import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StarRatingProps {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}

export const StarRating = ({
  rating,
  className,
  iconClassName,
  text,
}: StarRatingProps) => {
  /*
    so: 
       .min = choose the smallest always -> 5 here if someone put something > 5 it will keep the 5
       .max = choose the biggest always -> and 0 here if someone put something < 0 it will keep 0
  */
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));
  const onRating = (value: number) => {
    console.log(value + 1);
  };
  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          onClick={() => onRating(index)}
          className={cn(
            "cursor-pointer size-4",
            index < safeRating ? "fill-black" : "",
            iconClassName,
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
};
