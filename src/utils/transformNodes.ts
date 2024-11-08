// transformNodes.ts
export const transformNodes = (nodes: any[]) => {
    return nodes.map((node) => ({
      id: node.node_id,
      data: { label: node.node_id },
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // need to change this later
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
      },
    }));
  };
  