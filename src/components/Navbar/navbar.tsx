import Image from 'next/image';
import React from 'react';
import GraphVisualiser from '../../assets/GraphVisualiser.png'

interface NavbarProps {
    handleRunGraph: () => void;  // Assuming handleRunGraph is a function that takes no arguments and returns nothing
  }
  
  const Navbar: React.FC<NavbarProps> = ({ handleRunGraph }) => {
    return (
        <div className="bg-[#0f172a] text-white p-4 shadow-md flex justify-between items-center sticky top-0">
          <Image src={GraphVisualiser} alt='logo' width={120} height={120} />
          <button onClick={handleRunGraph} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
            Run Graph
          </button>
        </div>
    );
};

export default Navbar;