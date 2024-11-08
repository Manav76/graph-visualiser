// transformEdges.ts
export const transformEdges = (edges: any[]) => {
    return edges.map((edge) => ({
      id: `${edge.src_node}-${edge.dst_node}`,
      source: edge.src_node,
      target: edge.dst_node,
      type: 'smoothstep',
      animated: true,
      label: `${Object.entries(edge.src_to_dst_data_keys)
        .map(([srcKey, dstKey]) => `${srcKey} → ${dstKey}`)
        .join(', ')}`,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      labelStyle: { fill: '#ffffff', fontWeight: 'bold' },
    }));
  };
  