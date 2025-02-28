// import { ChevronLeft } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// interface SidebarToggleProps {
//   isOpen: boolean | undefined;
//   setIsOpen?: () => void;
// }

// export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
//   return (
//     <div className="invisible absolute right-[-16px] top-[30px] z-20  lg:visible">
//       <Button
//         onClick={() => setIsOpen?.()}
//         className="size-10 cursor-pointer rounded-full border-l border-l-primary"
//         variant="outline"
//         size="icon"
//       >
//         <ChevronLeft
//           className={cn(
//             "h-4 w-4 transition-transform ease-in-out duration-700",
//             isOpen === false ? "rotate-180" : "rotate-0"
//           )}
//         />
//       </Button>
//     </div>
//   );
// }

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    // <div className="invisible absolute right-[-16px] top-[65px] z-20 lg:visible">
    <div className="absolute right-[-16px] top-[65px] z-20  ">
      <Button
        onClick={() => setIsOpen?.()}
        className="border-primary rounded-full border-y-0 border-l-[3px] border-r-0 p-2 shadow-md transition hover:bg-gray-100"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform duration-500 ease-in-out",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
