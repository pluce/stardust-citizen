import CCUGraph from "../../lib/ccu_graph"

import {isNode} from 'react-flow-renderer';
import dagre from 'dagre';
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
  
    elements.forEach((el) => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });
  
    dagre.layout(dagreGraph);
  
    return elements.map((el) => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = isHorizontal ? 'left' : 'top';
        el.sourcePosition = isHorizontal ? 'right' : 'bottom';
  
        // unfortunately we need this little hack to pass a slighltiy different position
        // to notify react flow about the change. More over we are shifting the dagre node position
        // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }
  
      return el;
    });
  };

export default async (req, res) => {  
    const new_data = []
    CCUGraph.getShips().forEach(ship => {
        new_data.push({
            id: ship.id,
            data: { label: ship.name },
            position: { x: 0, y: 0 }
        })
    })
    CCUGraph.getCCUs().forEach(ccu => {
        new_data.push({
            id: `${ccu.id}-${ccu.from.id}-${ccu.to.id}`,
            source: ccu.from.id,
            target: ccu.to.id
        })
    })
    res.status(200).json(
        getLayoutedElements(new_data, "LR")
    )
}
