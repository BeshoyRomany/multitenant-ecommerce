"use client";
import { useState } from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const StarPicker = ({
  value = 0,
  onChange,
  disabled,
  className,
}: StarPickerProps) => {
  //will till each start we hover on 1,2,3,4,5
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed ",
        className,
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 transition",
            !disabled && "cursor-pointer hover:scale-110 ",
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              // if the i have value > or === star like "4 as a value > 3" it will fill the current start
              //means if the current star position less than the value , means the value will cover it also
              //same with the hover
              (hoverValue || value) >= star ? "fill-black" : "stroke-black",
            )}
          />
        </button>
      ))}
    </div>
  );
};
