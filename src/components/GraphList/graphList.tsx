import React from 'react';
import { useRouter } from 'next/router';

const mockGraphs = ["Graph 1", "Graph 2", "Graph 3"];

const GraphList: React.FC = () => {
  const router = useRouter();

  const handleGraphClick = (graphName: string) => {
    router.push(`/graph?name=${graphName}`);
  };

  return (
    <div className="graph-list">
      <h2>Available Graphs</h2>
      <ul>
        {mockGraphs.map((graph) => (
          <li key={graph} onClick={() => handleGraphClick(graph)}>
            {graph}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraphList;
