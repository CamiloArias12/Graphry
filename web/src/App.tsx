import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

export default function App() {
  const nodes = useRef<Array<any>>([]);
  const edges = useRef<Array<any>>([]);

  const [graphData, setGraphData] = useState<any>({});
  const nodeRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  const addNode = () => {
    nodes.current.push({ data: { id: nodeRef.current?.value } });
    setGraphData({ nodes: nodes.current, edges: edges.current });
  }
  const addEdge = () => {
    //@ts-ignore
    edges.current = ([...edges.current, { data: { source: sourceRef.current?.value, target: targetRef.current?.value, value: valueRef.current?.value } }])
    setGraphData({ nodes: nodes.current, edges: edges.current });
  }

  return (
    <>
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(graphData)}
        pan={{ x: 200, y: 200 }}
        style={{ width: "100%", height: "350px" }}
        zoomingEnabled={true}
        maxZoom={3}
        minZoom={0.1}
        autounselectify={false}
        boxSelectionEnabled={true}
        layout={layout}
        stylesheet={styleSheet}
      />

      <div>
        <label >Name</label>
        <input type="text" ref={nodeRef} />
        <button onClick={addNode}>Add node</button>
      </div>

      <div>
        <label >source</label>
        <input ref={sourceRef} />
        <label >target</label>
        <input ref={targetRef} />
        <label >Value</label>
        <input ref={valueRef} />
        <button onClick={addEdge}>Add edge</button>
      </div>

      <div>
        <button onClick={async () => {
          const phases: any = {};

          function findPhases(nodes) {
            var lastNode = Object.keys(nodes[Object.keys(nodes).length - 1])[0];
            phases[0] = 1;

            for (let node in nodes) {
              for (let key in nodes[node]) {
                phases[key] = phases[node] + 1;
              }
            }
            delete phases[lastNode];
          }

          let dict: any = {};
          console.log(edges.current);
          for (let edge of edges.current) {
            const data = edge.data;
            if (!(data.source in dict)) {
              console.log(data.source);
              dict[data.source] = {};
            }

            dict[data.source][data.target] = parseInt(data.value);
          }

          findPhases(dict);
          console.log(phases);

         const dataJson = await (await fetch("http://localhost:8000/data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nodes: JSON.stringify(dict),
              phases: JSON.stringify(phases),
            })
          })).json();

          console.log(dataJson);


        }}>
          Resolve
        </button>
      </div>
    </>
  );
}

const layout = {
  name: "breadthfirst",
  fit: true,
  directed: true,
  padding: 50,
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
      height: 70,
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
      "line-color": "#AAD8FF",
      label: "data(value)",
      "target-arrow-color": "#6774cb",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier"
    }
  }
];



