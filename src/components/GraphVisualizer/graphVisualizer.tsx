"use client";
import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  ReactFlowProvider,
  Controls,
  Background,
  SmoothStepEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphVisualizerProps {
  nodes: Node[];
  edges: Edge[];
}

const edgeTypes = {
  smoothstep: SmoothStepEdge,
};

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges }) => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '600px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          edgeTypes={edgeTypes}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          panOnDrag={true}
          // onNodeDragStop={onNodeDragStop}
        >
          <Controls />
          <Background color="#334155" gap={16} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default GraphVisualizer;

