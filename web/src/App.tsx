import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { layout, styleSheet } from "./styles";

export default function App() {
  const nodes = useRef<Array<any>>([]);
  const edges = useRef<Array<any>>([]);

  const [graphData, setGraphData] = useState<any>({});
  const nodeRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const [dataAPI, setDataAPI] = useState<{
    solution: any,
    way: Array<Array<any>>
  }>();

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

          const offset = 'a'.charCodeAt(0);

          function findPhases(nodes) {
            const keys = Object.keys(nodes).sort();
            const lastNode = keys[keys.length - 1]
            phases[0] = 1;

            for (const node in nodes) {
              for (const key in nodes[node]) {
                phases[key] = phases[node] + 1;
              }
            }
            delete phases[parseInt(lastNode) + 1];
          }

          let dict: any = {};
          for (let edge of edges.current) {
            const data = edge.data;
            const sourceOffset = data.source.charCodeAt(0) - offset;
            const targetOffset = data.target.charCodeAt(0) - offset;

            if (!(sourceOffset in dict)) {
              dict[sourceOffset] = {};
            }

            dict[sourceOffset][targetOffset] = parseInt(data.value);
          }

          findPhases(dict);
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

          const way = JSON.parse(dataJson.way);
          const solution = JSON.parse(dataJson.solution);
          setDataAPI({
            way: way,
            solution: solution
          });
        }}>
          Resolve
        </button>
      </div>

      {
        dataAPI?.way &&

        <>
          <h2>Best way</h2>
          {
            dataAPI.way.map((value) => {
              return value.map((path, index) => {
                const nodeLabel = String.fromCharCode('a'.charCodeAt(0) + parseInt(path));
                return (
                  <>
                    <span>{nodeLabel}</span>
                    {
                      value.length - 1 != index && <span>{" -> "}</span>
                    }
                  </>
                )
              });
            })
          }
        </>
      }

      {
        dataAPI?.solution &&
        <>

        </>
      }
    </>
  );
}


