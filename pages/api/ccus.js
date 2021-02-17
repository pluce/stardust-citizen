// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promises as fs } from 'fs'
import { WeightedDiGraph, Edge, Dijkstra } from 'js-graph-algorithms'

import ships from "../../app/data/ships.json"
import edges from "../../app/data/edges.json"

let graph = null
let sid_to_gid = {}
let gid_to_ship = {}
let edge_details = {}

const load_graph = async () => {
  console.log("Loading graph")
  if(graph) {
    return graph
  }
  for(let gid in ships) {
    gid_to_ship[gid] = ships[gid]
    sid_to_gid[ships[gid].id] = gid
  }
  graph = new WeightedDiGraph(ships.length);
  for(let ship_id of Object.keys(edges)) {
    for(let edge of edges[ship_id]) {
      const real_edges = edge.skus.filter(x => x.available).map(x => ({...x, to_id: edge.id}))
      
      if (real_edges.length == 0) {
        continue
      }
      if (!edge_details[ship_id]) {
        edge_details[ship_id] = {}
      }
      edge_details[ship_id][edge.id] = real_edges
      const min_upgrade_price = Math.min(...real_edges.map(x => x.upgradePrice))
      graph.addEdge(new Edge(sid_to_gid[ship_id], sid_to_gid[edge.id], min_upgrade_price))
    }
  }
  return graph
}

export default async (req, res) => {
  let { from, to } = req.query

  if(!from || !to) {
    return res.status(400).json({error: "Missing parameters"})
  }
  const ccus = await load_graph()
  const dijk = new Dijkstra(ccus, sid_to_gid[from])
  if (from == to || !dijk.hasPathTo(sid_to_gid[to])) {
    return res.status(200).json({no_path: true})
  }
  const djs = dijk.pathTo(sid_to_gid[to])
  console.log(djs)
  let total_ccu_price = 0
  const computed_ccus = djs.map(e => {
    const skus = edge_details[gid_to_ship[e.v].id][gid_to_ship[e.w].id]
    skus.sort((a,b) => a.upgradePrice - b.upgradePrice)
    total_ccu_price+=skus[0].upgradePrice
    return {
      ...skus[0],
      from: ships[e.v],
      to: ships[sid_to_gid[skus[0].to_id]]
    }
  })
  const result = {
    total_ccu_price,
    ccus: computed_ccus
  }
  res.status(200).json(result)
}

//P72 - 104
//85X
//CNOU NOMAD
//FREELANCER MAX - 32