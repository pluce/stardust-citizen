import CCUGraph from "../../lib/ccu_graph"

export default async (req, res) => {  
  res.status(200).json(CCUGraph.getShips())
}
