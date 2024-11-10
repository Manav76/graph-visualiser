// transformEdges.ts
// export const transformEdges = (edges: any[]) => {
//     return edges.map((edge) => ({
//       id: `${edge.src_node}-${edge.dst_node}`,
//       source: edge.src_node,
//       target: edge.dst_node,
//       type: 'smoothstep',
//       animated: true,
//       label: `${Object.entries(edge.src_to_dst_data_keys)
//         .map(([srcKey, dstKey]) => `${srcKey} → ${dstKey}`)
//         .join(', ')}`,
//       style: { stroke: '#6366f1', strokeWidth: 2 },
//       labelStyle: { fill: '#ffffff', fontWeight: 'bold' },
//     }));
//   };
  

// import type { Edge } from 'reactflow';
import type { CustomEdge } from "./graphAlgos";

export const transformEdges = (edges: any[]): CustomEdge[] => {
  return edges.map((edge, index) => ({
    id: `${edge.src_node}-${edge.dst_node}-${index}`,
    src_node: edge.src_node,
    dst_node: edge.dst_node,
    src_to_dst_data_keys: edge.src_to_dst_data_keys,
    source: edge.src_node,
    target: edge.dst_node,
    type: 'smoothstep',
    animated: true,
    label: Object.entries(edge.src_to_dst_data_keys)
      .map(([srcKey, dstKey]) => `${srcKey} → ${dstKey}`)
      .join(', '),
    style: { stroke: '#6366f1', strokeWidth: 2 },
    labelStyle: { fill: '#ffffff', fontWeight: 'bold' },
    markerEnd: 'arrowclosed',
  }));
};



