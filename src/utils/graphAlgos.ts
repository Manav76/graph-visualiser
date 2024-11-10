// utils/graphUtils.ts
export interface CustomEdge {
    id: string;
    src_node: string;
    dst_node: string;
    src_to_dst_data_keys: Record<string, string>;
    source: string;
    target: string;
    type: string;
    animated: boolean;
    label: string;
    style: { stroke: string; strokeWidth: number };
    labelStyle: { fill: string; fontWeight: string };
  }

interface Node {
  node_id: string;
  data_in: Record<string, any>;
  data_out: Record<string, any>;
  paths_in: string[];
  paths_out: string[];
}

  
  interface Node {
    node_id: string;
    data_in: Record<string, any>;
    data_out: Record<string, any>;
    paths_in: string[];
    paths_out: string[];
  }

  // Check for cycles using DFS
  export const validateGraphForCycles = (nodes: Node[], edges: CustomEdge[]): boolean => {
    const visited: Set<string> = new Set();
    const visiting: Set<string> = new Set();
  
    const hasCycle = (nodeId: string): boolean => {
      if (visited.has(nodeId)) return false;
      if (visiting.has(nodeId)) return true;
  
      visiting.add(nodeId);
      const outgoingEdges = edges.filter((edge) => edge.src_node === nodeId);
  
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.dst_node)) {
          return true;
        }
      }
  
      visiting.delete(nodeId);
      visited.add(nodeId);
      return false;
    };
  
    for (const node of nodes) {
      if (hasCycle(node.node_id)) {
        return false;
      }
    }
  
    return true;
  };
  
  // Check for disconnected components
  export const validateGraphConnectivity = (nodes: Node[], edges: CustomEdge[]): boolean => {
    const reachable: Set<string> = new Set();
    const queue: string[] = [];
  
    // Start from all root nodes (nodes with no incoming edges)
    const rootNodes = nodes.filter((node) =>
      edges.every((edge) => edge.dst_node !== node.node_id)
    );
  
    if (rootNodes.length === 0) return false; // No root nodes found
  
    rootNodes.forEach((node) => queue.push(node.node_id));
  
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      reachable.add(currentNode);
  
      const outgoingEdges = edges.filter((edge) => edge.src_node === currentNode);
      outgoingEdges.forEach((edge) => {
        if (!reachable.has(edge.dst_node)) {
          queue.push(edge.dst_node);
        }
      });
    }
  
    // Check if all nodes are reachable
    return nodes.every((node) => reachable.has(node.node_id));
  };
  
  // Check for data type compatibility between connected nodes
  export const validateDataTypeCompatibility = (nodes: Node[], edges: CustomEdge[]): boolean => {
    const nodeMap = Object.fromEntries(nodes.map((node) => [node.node_id, node]));
  
    for (const edge of edges) {
      const srcNode = nodeMap[edge.src_node];
      const dstNode = nodeMap[edge.dst_node];
  
      for (const [srcKey, dstKey] of Object.entries(edge.src_to_dst_data_keys)) {
        if (typeof srcNode.data_out[srcKey] !== typeof dstNode.data_in[dstKey]) {
          return false; // Data types do not match
        }
      }
    }
  
    return true;
  };
  
  // Check for multiple root nodes
  export const validateSingleRootNode = (nodes: Node[], edges:CustomEdge[]): boolean => {
    const rootNodes = nodes.filter((node) =>
      edges.every((edge) => edge.dst_node !== node.node_id)
    );
    return rootNodes.length === 1;
  };
  
  // Check for redundant edges
  export const validateRedundantEdges = (edges: CustomEdge[]): boolean => {
    const edgeSet = new Set<string>();
  
    for (const edge of edges) {
      const edgeKey = `${edge.src_node}->${edge.dst_node}`;
      if (edgeSet.has(edgeKey)) {
        return false; // Redundant edge found
      }
      edgeSet.add(edgeKey);
    }
  
    return true;
  };
  export const executeGraph = (nodes: Node[], edges: CustomEdge[], overwrites: Record<string, Record<string, any>>) => {
    const nodeMap = Object.fromEntries(nodes.map((node) => [node.node_id, node]));
    const result: Record<string, any> = {};
  
    const executeNode = (nodeId: string) => {
      const node = nodeMap[nodeId];
      const dataIn = { ...node.data_in, ...(overwrites[nodeId] || {}) };
  
      // Populate data_out based on data_in
      Object.keys(dataIn).forEach((key) => {
        node.data_out[key] = dataIn[key];
      });
  
      result[nodeId] = { ...node.data_out };
    };
  
    // Topological order execution
    const visited = new Set<string>();
    const visitNode = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
  
      const incomingEdges = edges.filter((edge) => edge.dst_node === nodeId);
      incomingEdges.forEach((edge) => visitNode(edge.src_node));
  
      executeNode(nodeId);
    };
  
    nodes.forEach((node) => visitNode(node.node_id));
  
    return result;
  };