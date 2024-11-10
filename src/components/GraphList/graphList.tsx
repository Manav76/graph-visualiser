"use client";

import React from 'react';

interface GraphListProps {
  graphs: { id: string }[];
  onSelectGraph: (id: string) => void;
}

const GraphList: React.FC<GraphListProps> = ({ graphs, onSelectGraph }) => {
  return (
    <div className="w-full max-w-xs bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Available Graphs</h2>
      <ul className="space-y-2">
        {graphs.map((graph) => (
          <li
            key={graph.id}
            className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => onSelectGraph(graph.id)}
          >
            {graph.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraphList;
