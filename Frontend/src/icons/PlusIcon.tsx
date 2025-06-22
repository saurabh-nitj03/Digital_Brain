
import { iconSizeVariants, type IconProps } from "."

export const PlusIcon=(props:IconProps) =>{
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={iconSizeVariants[props.size]}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
}

// import type { ReactElement } from "react";

// export const PlusIcon = (): ReactElement => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5} // ✅ camelCase
//       stroke="currentColor"
//       className="w-6 h-6" // ✅ preferred over 'size-6' for clarity
//     >
//       <path
//         strokeLinecap="round" // ✅ camelCase
//         strokeLinejoin="round" // ✅ camelCase
//         d="M12 4.5v15m7.5-7.5h-15"
//       />
//     </svg>
//   );
// };
