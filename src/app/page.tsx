"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import graphData from '../services/graph.json';
import { transformEdges } from '../utils/transformEdges';
import { transformNodes } from '../utils/transformNodes';

const GraphVisualizer = dynamic(() => import('../components/GraphVisualizer/graphVisualizer'), { ssr: false });

export default function Home() {
  const { nodes, edges } = graphData;
  const transformedNodes = transformNodes(nodes);
  const transformedEdges = transformEdges(edges);

  // console.log('Transformed Nodes:', transformedNodes);
  // console.log('Transformed Edges:', transformedEdges);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <GraphVisualizer nodes={transformedNodes} edges={transformedEdges} />
    </div>
  );
}

