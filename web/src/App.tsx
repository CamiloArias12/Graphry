
import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import NodeContextMenu from "./Menu";

export default function App() {
  const [width, setWith] = useState("100%");
  const [height, setHeight] = useState("1000px");
  const [showMenu,setShowMenu]=useState(false) 
  const [nodes,setNodes]=useState([
  ])
  const [edges,setEdges]= useState([
      ])

  const [graphData, setGraphData] = useState({
    nodes
    ,
   edges
  });

useEffect(() => {
      setGraphData({nodes,edges})

},[nodes,edges])


   const [node,setNode]=useState("")
   const [source,setSource]=useState("")
   const [target,setTarget]=useState("")
   const [value,setValue]=useState("")

  const addNode =()=>{
 //@ts-ignore
      setNodes([...nodes,{data:{ id:node}}])
  }
 const addEdge =()=>{
 //@ts-ignore
      setEdges([...edges,{data:{ source:source,target:target,value:value}}])
}

  const layout = {
    name: "breadthfirst",
    fit: true,
    // circle: true,
    directed: true,
    padding: 50,
    // spacingFactor: 1.5,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false
  };

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 30,
        height: 30,
        label: "data(id)",

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "2px",
        color: "white",
        fontSize: 20
      }
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 70,
        height:70,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle"
      }
    },
    {
      selector: "edge",
      style: {
        width: 6,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
	 label: "data(value)",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ];

  let myCyRef;

  return (
    <>
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(graphData)}
            pan={{ x: 200, y: 200 }}
            style={{ width: width, height: height }}
            zoomingEnabled={true}
            maxZoom={3}
            minZoom={0.1}
            autounselectify={false}
            boxSelectionEnabled={true}
	    
            layout={layout}
            stylesheet={styleSheet}
            cy={cy => {
              myCyRef = cy;

              console.log("EVT", cy);

              cy.on("tap", "node", evt => {
	        setShowMenu(true)
                console.log("EVT", evt);
                console.log("TARGET", node.data());
                console.log("TARGET TYPE", typeof node[0]);
              });
            }}
            abc={console.log("myCyRef", myCyRef)}
          />
	 <div>
	    <label >Name</label>
	    <input value={node} onChange={(e) =>{setNode(e.target.value)}} />
	    <button onClick={addNode}>Add node</button>
	 </div>
	 <div>
	    <label >source</label>
	    <input value={source} onChange={(e) =>{setSource(e.target.value)}} />
	    <label >target</label>
	    <input value={target} onChange={(e) =>{setTarget(e.target.value)}} />
	    <label >Value</label>
	    <input value={value} onChange={(e) =>{setValue(e.target.value)}} />
	    <button onClick={addEdge}>Add edge</button>

	 </div>
	 
	 {showMenu &&<NodeContextMenu onEdit={addNode} onDelete={addEdge}/>}
    </>
  );
}

