// import React, { useState } from 'react';

// const GraphControls: React.FC = () => {
//   const [enabledNodes, setEnabledNodes] = useState<string[]>([]);

//   const toggleNode = (nodeId: string) => {
//     setEnabledNodes((prev) =>
//       prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
//     );
//   };

//   return (
//     <div className="graph-controls">
//       <button onClick={() => toggleNode("A")}>Toggle Node A</button>
//       <button onClick={() => toggleNode("B")}>Toggle Node B</button>
//     </div>
//   );
// };

// export default GraphControls;
