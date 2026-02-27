import React from 'react';
import { Watch } from 'lucide-react';

const NotFound = () => {
  return (
    <div className='
      card bg-neutral-900 
      min-h-8 md:h-64 lg:h-80 
      w-full px-6 py-10
      flex flex-col md:flex-row items-center justify-center gap-6 
      jetbrains-mono-600 rounded-xl shadow-2xl'
    >
      {/* Icon: Scales with screen size */}
      <div className="shrink-0">
        <Watch 
          className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" 
          strokeWidth={1} 
          color="#937f1b" 
        />
      </div>

      {/* Text: Adjusts size and alignment */}
      <p className='text-amber-100 text-2xl md:text-4xl lg:text-5xl text-center md:text-left leading-tight'> 
        404 Page Not Found!
      </p>
    </div>
  );
};

export default NotFound;