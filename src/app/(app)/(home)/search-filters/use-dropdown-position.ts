import { RefObject } from "react";

export const useDropdownPosition = (
  // Accept both nullable and read-only refs to ensure compatibility across the project.
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>,
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; //Width of dropdown (w-60 = 15rem = 240px)

    //calculate the initial position + scroll

    /* getBoundingClientRect() returns position relative to what you SEE (viewport)
     scrollX/Y = how much you have scrolled
     real position = what you see + how much you scrolled
     example: element at 80px, scrolled 20px right → rect.left = 60px → 60 + 20 = 80px
     so: dropdown will always appear right below the button even after scrolling 
    */
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    //Check if dropdown would go off the right edge of the viewport
    /*
      Example: Screen 1000px, Button starts at 950px (left), ends at 1010px (right).
      Default: 950 (left) + 240 (dropdown) = 1190px (> 1000px screen) -> Overflow!
      Fix: Start from button's right edge (1010) and go back by dropdown width (240).
      Result: 1010 - 240 = 770px. Now the dropdown is fully inside the screen.
    */
    if (left + dropdownWidth > window.innerWidth) {
      //Align to right edge of button instead
      left = rect.right + window.scrollX - dropdownWidth;

      //If still off-screen, align to the right edge of viewport with some padding
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 16;
      }

      //Ensure dropdown doesn't go off left edge
      if (left < 0) {
        left = 16;
      }
    }
    return { top, left };
  };
  return { getDropdownPosition };
};
