import React, { useCallback, useState, useMemo } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from "react-force-graph";
import SpriteText from "three-spritetext";
import data from "./data.json";
import largeData from "./blocks.json";

const genRandomTree = (N = 300, reverse = false) => {
	return {
		nodes: [...Array(N).keys()].map(i => ({ id: i })),
		links: [...Array(N).keys()]
			.filter(id => id)
			.map(id => ({
				[reverse ? "target" : "source"]: id,
				[reverse ? "source" : "target"]: Math.round(
					Math.random() * (id - 1),
				),
			})),
	};
};

export const CSB = props => {
	// console.log({ data });
	const GROUPS = 12;
	const gData = genRandomTree();
	const rData = {
		nodes: [...Array(14).keys()].map(i => ({ id: i })),
		links: [
			{ source: 0, target: 1, curvature: 0, rotation: 0 },
			{ source: 0, target: 1, curvature: 0.8, rotation: 0 },
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 1) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 2) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 3) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 4) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 5) / 6,
			},
			{ source: 0, target: 1, curvature: 0.8, rotation: Math.PI },
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 7) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 8) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 9) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 10) / 6,
			},
			{
				source: 0,
				target: 1,
				curvature: 0.8,
				rotation: (Math.PI * 11) / 6,
			},
			{ source: 2, target: 3, curvature: 0.4, rotation: 0 },
			{ source: 3, target: 2, curvature: 0.4, rotation: Math.PI / 2 },
			{ source: 2, target: 3, curvature: 0.4, rotation: Math.PI },
			{ source: 3, target: 2, curvature: 0.4, rotation: -Math.PI / 2 },
			{ source: 4, target: 4, curvature: 0.3, rotation: 0 },
			{
				source: 4,
				target: 4,
				curvature: 0.3,
				rotation: (Math.PI * 2) / 3,
			},
			{
				source: 4,
				target: 4,
				curvature: 0.3,
				rotation: (Math.PI * 4) / 3,
			},
			{ source: 5, target: 6, curvature: 0, rotation: 0 },
			{ source: 5, target: 5, curvature: 0.5, rotation: 0 },
			{ source: 6, target: 6, curvature: -0.5, rotation: 0 },
			{ source: 7, target: 8, curvature: 0.2, rotation: 0 },
			{ source: 8, target: 9, curvature: 0.5, rotation: 0 },
			{ source: 9, target: 10, curvature: 0.7, rotation: 0 },
			{ source: 10, target: 11, curvature: 1, rotation: 0 },
			{ source: 11, target: 12, curvature: 2, rotation: 0 },
			{ source: 12, target: 7, curvature: 4, rotation: 0 },
			{ source: 13, target: 13, curvature: 0.1, rotation: 0 },
			{ source: 13, target: 13, curvature: 0.2, rotation: 0 },
			{ source: 13, target: 13, curvature: 0.5, rotation: 0 },
			{ source: 13, target: 13, curvature: 0.7, rotation: 0 },
			{ source: 13, target: 13, curvature: 1, rotation: 0 },
		],
	};
	const NODE_R = 8;
	const HighlightGraph = () => {
		const [data] = useState(genRandomTree(80));
		const [highlightNodes, setHighlightNodes] = useState([]);
		const [highlightLink, setHighlightLink] = useState(null);
		const handleNodeHover = useCallback(
			node => {
				setHighlightNodes(node ? [node] : []);
			},
			[setHighlightNodes],
		);
		const handleLinkHover = useCallback(
			link => {
				setHighlightLink(link);
				setHighlightNodes(link ? [link.source, link.target] : []);
			},
			[setHighlightLink, setHighlightNodes],
		);
		const paintRing = useCallback((node, ctx) => {
			// add ring just for highlighted nodes
			ctx.beginPath();
			ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
			ctx.fillStyle = "red";
			ctx.fill();
		}, []);
		return (
			<ForceGraph2D
				graphData={data}
				nodeRelSize={NODE_R}
				linkWidth={link => (link === highlightLink ? 5 : 1)}
				linkDirectionalParticles={4}
				linkDirectionalParticleWidth={link =>
					link === highlightLink ? 4 : 0
				}
				nodeCanvasObjectMode={node =>
					highlightNodes.indexOf(node) !== -1 ? "before" : undefined
				}
				nodeCanvasObject={paintRing}
				onNodeHover={handleNodeHover}
				onLinkHover={handleLinkHover}
			/>
		);
	};
	const ExpandableGraph = ({ graphData }) => {
		const rootId = 0;
		const nodesById = useMemo(() => {
			const nodesById = Object.fromEntries(
				graphData.nodes.map(node => [node.id, node]),
			);
			// link parent/children
			graphData.nodes.forEach(node => {
				node.collapsed = node.id !== rootId;
				node.childLinks = [];
			});
			graphData.links.forEach(link =>
				nodesById[link.source].childLinks.push(link),
			);
			return nodesById;
		}, [graphData]);
		const getPrunedTree = useCallback(() => {
			const visibleNodes = [];
			const visibleLinks = [];
			(function traverseTree(node = nodesById[rootId]) {
				visibleNodes.push(node);
				if (node.collapsed) return;
				visibleLinks.push(...node.childLinks);
				node.childLinks
					.map(link =>
						typeof link.target === "object"
							? link.target
							: nodesById[link.target],
					) // get child node
					.forEach(traverseTree);
			})();
			return { nodes: visibleNodes, links: visibleLinks };
		}, [nodesById]);
		const [prunedTree, setPrunedTree] = useState(getPrunedTree());
		const handleNodeClick = useCallback(node => {
			node.collapsed = !node.collapsed; // toggle collapse state
			setPrunedTree(getPrunedTree());
		}, []);
		return (
			<ForceGraph2D
				graphData={prunedTree}
				linkDirectionalParticles={2}
				backgroundColor="darkgrey"
				nodeColor={node =>
					!node.childLinks.length
						? "green"
						: node.collapsed
						? "red"
						: "yellow"
				}
				onNodeClick={handleNodeClick}
			/>
		);
	};

	return (
		// <ForceGraph2D
		// 	graphData={data}
		// 	nodeLabel="id"
		// 	nodeAutoColorBy="group"
		// 	linkDirectionalParticles="value"
		// 	linkDirectionalParticleSpeed={d => d.value * 0.001}
		// />
		// <ForceGraph2D
		// 	graphData={gData}
		// 	nodeAutoColorBy={d => d.id % GROUPS}
		// 	linkAutoColorBy={d => gData.nodes[d.source].id % GROUPS}
		// 	linkWidth={2}
		// />
		// <HighlightGraph />
		// <ForceGraph2D
		// 	graphData={data}
		// 	nodeLabel="id"
		// 	nodeAutoColorBy="group"
		// 	onNodeDragEnd={node => {
		// 		node.fx = node.x;
		// 		node.fy = node.y;
		// 		node.fz = node.z;
		// 	}}
		// />
		// <ForceGraph2D
		// 	graphData={gData}
		// 	nodeAutoColorBy={d => d.id % GROUPS}
		// 	linkAutoColorBy={d => gData.nodes[d.source].id % GROUPS}
		// 	linkWidth={2}
		// />
		// <ExpandableGraph graphData={genRandomTree(600, true)} />
		// <ForceGraph2D
		// 	graphData={rData}
		// 	linkCurvature="curvature"
		// 	linkCurveRotation="rotation"
		// 	linkDirectionalParticles={2}
		// />
		// <ForceGraph2D
		// 	graphData={data}
		// 	nodeLabel="id"
		// 	nodeAutoColorBy="group"
		// 	linkThreeObjectExtend={true}
		// 	linkThreeObject={link => {
		// 		// extend link with text sprite
		// 		const sprite = new SpriteText(
		// 			`${link.source} > ${link.target}`,
		// 		);
		// 		sprite.color = "black";
		// 		sprite.textHeight = 1.5;
		// 		return sprite;
		// 	}}
		// 	linkPositionUpdate={(sprite, { start, end }) => {
		// 		const middlePos = Object.assign(
		// 			...["x", "y", "z"].map(c => ({
		// 				[c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
		// 			})),
		// 		);
		// 		// Position sprite
		// 		Object.assign(sprite.position, middlePos);
		// 	}}
		// />
		<ForceGraph2D
			graphData={largeData}
			nodeLabel={node => `${node.user}: ${node.description}`}
			nodeAutoColorBy="user"
			linkDirectionalParticles={1}
		/>
	);
};
