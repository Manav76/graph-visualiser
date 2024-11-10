// GraphVisualizer.tsx
"use client";

import ReactFlow, { Node, Edge, ReactFlowProvider, Controls, Background, SmoothStepEdge } from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onSelectNode: (nodeId: string) => void;
}

const edgeTypes = {
  smoothstep: SmoothStepEdge,
};

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges, onSelectNode }) => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '500px', backgroundColor: '#0f172a', borderRadius: '4px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          edgeTypes={edgeTypes}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          panOnDrag={true}
          onNodeClick={(event, node) => onSelectNode(node.id)}
        >
          <Controls />
          <Background color="#334155" gap={16} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default GraphVisualizer;
