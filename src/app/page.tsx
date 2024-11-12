"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import graphsData from '../services/graphs.json';
import { CustomEdge } from '../utils/graphAlgos';
import { transformEdges } from '../utils/transformEdges';
import { transformNodes } from '../utils/transformNodes';
import {
  validateGraphForCycles,
  validateDataTypeCompatibility,
  validateGraphConnectivity,
  validateRedundantEdges,
  validateSingleRootNode,
  executeGraph,
} from '../utils/graphAlgos';
import Navbar from '../components/Navbar/navbar';

const GraphVisualizer = dynamic(() => import('../components/GraphVisualizer/graphVisualizer'), { ssr: false });

export default function Home() {
  const [selectedGraphId, setSelectedGraphId] = useState<string | null>(graphsData[0]?.id || null);
  const [nodeState, setNodeState] = useState<Record<string, boolean>>(
    Object.fromEntries(graphsData[0]?.nodes.map((node) => [node.node_id, node.enabled]) || [])
  );
  const [dataInOverwrites, setDataInOverwrites] = useState<Record<string, Record<string, any>>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [isEditingNodeId, setIsEditingNodeId] = useState<boolean>(false);
  const [graphOutput, setGraphOutput] = useState<Record<string, any> | null>(null);

  const selectedGraph = graphsData.find((graph) => graph.id === selectedGraphId);
  const transformedNodes = transformNodes(selectedGraph?.nodes || [], nodeState, dataInOverwrites);
  const transformedEdges: CustomEdge[] = transformEdges(selectedGraph?.edges || []);

  const handleSelectGraph = (id: string) => {
    setSelectedGraphId(id);
    toast.success(`Selected ${id}`);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsEditingNodeId(true);
  };

  const getAvailableNodeIds = () => {
    return selectedGraph?.nodes
      .filter((node) => nodeState[node.node_id] && node.node_id !== selectedNodeId)
      .map((node) => node.node_id);
  };

  const handleSwapNodeId = () => {
    if (!selectedNodeId || !selectedGraph || !newNodeId) return;
  
    const nodesCopy = [...selectedGraph.nodes];
    const nodeIndex = nodesCopy.findIndex(node => node.node_id === selectedNodeId);
    const newNodeIndex = nodesCopy.findIndex(node => node.node_id === newNodeId);
  
    if (nodeIndex === -1 || newNodeIndex === -1) return;
  
    // Swapping the IDs in the nodes array
    [nodesCopy[nodeIndex].node_id, nodesCopy[newNodeIndex].node_id] = [nodesCopy[newNodeIndex].node_id, nodesCopy[nodeIndex].node_id];
  
    // Update the graph state (if you're maintaining it in a state)
    // setSelectedGraph({...selectedGraph, nodes: nodesCopy});
  
    // Remapping dataInOverwrites using functional update
    setDataInOverwrites(prevState => {
      const newDataInOverwrites = {...prevState};
      const temp = newDataInOverwrites[selectedNodeId];
      newDataInOverwrites[selectedNodeId] = newDataInOverwrites[newNodeId];
      newDataInOverwrites[newNodeId] = temp;
      return newDataInOverwrites;
    });
  
    setIsEditingNodeId(false);
    setNewNodeId(null); // Clear the selected new node ID after swapping
    toast.success(`Node IDs swapped: ${selectedNodeId} ↔ ${newNodeId}`);
  };

  const handleToggleNode = (nodeId: string) => {
    setNodeState((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
  };

  const handleRunGraph = () => {
    try {
      const isAcyclic = validateGraphForCycles(selectedGraph?.nodes || [], transformedEdges);
      const isConnected = validateGraphConnectivity(selectedGraph?.nodes || [], transformedEdges);
      const isDataTypeCompatible = validateDataTypeCompatibility(selectedGraph?.nodes || [], transformedEdges);
      const hasSingleRoot = validateSingleRootNode(selectedGraph?.nodes || [], transformedEdges);
      const hasNoRedundantEdges = validateRedundantEdges(transformedEdges);

      if (!isAcyclic) {
        toast.error('Validation failed: Cycle detected.');
        return;
      }
      if (!isConnected) {
        toast.error('Validation failed: Graph is not fully connected.');
        return;
      }
      if (!isDataTypeCompatible) {
        toast.error('Validation failed: Data type mismatch between nodes.');
        return;
      }
      if (!hasSingleRoot) {
        toast.error('Validation failed: Multiple root nodes detected.');
        return;
      }
      if (!hasNoRedundantEdges) {
        toast.error('Validation failed: Redundant edges detected.');
        return;
      }

      debugger

      const output = executeGraph(selectedGraph?.nodes || [], transformedEdges, dataInOverwrites);
      setGraphOutput(output);
      toast.success('Graph executed successfully.');
    } catch (error: any) {
      toast.error(`Graph execution failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <Navbar handleRunGraph={handleRunGraph} />

      <div className="flex flex-row w-full p-4 bg-[#1a1a2e] gap-4">
        <div className="w-1/4 h-[86vh] p-4 bg-[#282a36] rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Available Graphs</h3>
          <ul className="space-y-2 text-white">
            {graphsData.map((graph) => (
              <li
                key={graph.id}
                className={`cursor-pointer p-2 rounded ${selectedGraphId === graph.id ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-600 transition-all`}
                onClick={() => handleSelectGraph(graph.id)}
              >
                {graph.id}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col w-3/4 gap-4">
          <div className='p-2 bg-[#282a36] rounded-lg'>
            <h3 className="text-xl font-semibold text-white mb-4">Nodes</h3>
            <ul className="flex flex-row flex-wrap space-x-4">
              {selectedGraph?.nodes.map((node) => (
                <li key={node.node_id} className="flex items-center mb-2 text-white">
                  <span className="mr-2">{node.node_id}</span>
                  <button
                    className={`px-3 py-1 rounded ${nodeState[node.node_id] ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => handleToggleNode(node.node_id)}
                  >
                    {nodeState[node.node_id] ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleSelectNode(node.node_id)}
                  >
                    Edit ID
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 p-4 bg-[#121212] rounded-lg">
            <GraphVisualizer nodes={transformedNodes} edges={transformedEdges} onSelectNode={handleSelectNode} />
          </div>
        </div>


      </div>

      {graphOutput && (
        <div className="p-4 bg-[#0f172a] text-white rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Graph Output</h3>
          <pre>{JSON.stringify(graphOutput, null, 2)}</pre>
        </div>
      )}
      {isEditingNodeId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Node ID: {selectedNodeId}</h3>
            <select
              className="p-2 border rounded w-full"
              value={newNodeId || ''}
              onChange={(e) => setNewNodeId(e.target.value)}
            >
              <option value="">Select New ID</option>
              {getAvailableNodeIds()?.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <div className="flex justify-center space-x-2 mt-4">
              <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer" onClick={() => setIsEditingNodeId(!isEditingNodeId)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white cursor-pointer" onClick={() => handleSwapNodeId()}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}