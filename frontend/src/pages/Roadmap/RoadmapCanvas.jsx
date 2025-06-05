import React, { useCallback, useState } from 'react'
import { ReactFlow, Controls, MiniMap, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';

// Custom styles to eliminate white space
const customStyles = `
    .react-flow__renderer {
        background: transparent !important;
    }
    .react-flow__background {
        background: transparent !important;
    }
    .react-flow__pane {
        background: transparent !important;
    }
`;

const nodeTypes = {
    turbo: TurboNode
}

const RoadmapCanvas = ({ initialNodes, initialEdges }) => {
    // Use ReactFlow hooks for state management
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);

    // Handle new connections
    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge({
            ...params,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 }
        }, eds));
    }, [setEdges]);

    // Handle node drag end (optional: save positions)
    const onNodeDragStop = useCallback((event, node) => {
        console.log('Node dragged:', node.id, 'to position:', node.position);
        // You can save the new position to your backend here if needed
    }, []);

    const defaultEdgeOptions = {
        animated: true,
        style: {
            stroke: '#3b82f6',
            strokeWidth: 2,
        },
    };

    const connectionLineStyle = {
        stroke: '#3b82f6',
        strokeWidth: 2,
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: 'transparent' }}>
                <ReactFlow 
                nodes={nodes} 
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineStyle={connectionLineStyle}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                selectNodesOnDrag={false}
                fitView
                fitViewOptions={{
                    padding: 0.1,
                    includeHiddenNodes: false,
                }}
                minZoom={0.2}
                maxZoom={1.5}
                proOptions={{ hideAttribution: true }}
                style={{
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                }}
            >
                {/* Custom styled controls */}
                <Controls 
                    className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg shadow-lg"
                    style={{
                        button: {
                            backgroundColor: 'white',
                            border: '1px solid rgb(226 232 240 / 0.5)',
                            color: '#475569',
                        }
                    }}
                />
                
                {/* Enhanced MiniMap */}
                <MiniMap 
                    className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg shadow-lg overflow-hidden"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                    nodeColor={(node) => {
                        if (node.type === 'turbo') return '#3b82f6';
                        return '#64748b';
                    }}
                    nodeStrokeWidth={2}
                    zoomable
                    pannable
                />
                
                {/* Enhanced Background - this should eliminate white space */}
                <Background 
                    variant="dots" 
                    gap={20} 
                    size={1} 
                    color="#cbd5e1"
                    style={{
                        background: 'transparent',
                        backgroundColor: 'transparent',
                        opacity: 0.4,
                    }}
                />
            </ReactFlow>
            </div>
        </>
    )
}

export default RoadmapCanvas