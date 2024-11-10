import { Node } from 'reactflow';

export const transformNodes = (
  nodes: any[],
  nodeState: Record<string, boolean>,
  dataInOverwrites: Record<string, Record<string, any>>
): Node[] => {
  const nodeSpacingX = 200;
  const nodeSpacingY = 150;

  return nodes.map((node, index) => {
    // Apply dataInOverwrites to node data
    const dataIn = { ...node.data_in, ...(dataInOverwrites[node.node_id] || {}) };

    return {
      id: node.node_id,
      type: 'default',
      data: {
        label: node.node_id,
        dataIn, // Include dataIn for display purposes
      },
      position: {
        x: (index % 4) * nodeSpacingX,
        y: Math.floor(index / 4) * nodeSpacingY,
      },
      style: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #6366f1',
        opacity: nodeState[node.node_id] ? 1 : 0.5,
        pointerEvents: nodeState[node.node_id] ? 'auto' : 'none',
      },
      draggable: true,
    };
  });
};
