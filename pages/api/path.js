// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import CCUGraph from "../../lib/ccu_graph"

export default async (req, res) => {
  let { from, to, free_ccus } = req.query

  if(!from || !to) {
    return res.status(400).json({error: "Missing parameters"})
  }
  if(free_ccus) {
    free_ccus = free_ccus.split(",")
  }
  
  res.status(200).json(CCUGraph.getCheapestCCUPath(from,to,free_ccus))
}

//P72 - 104
//85X
//CNOU NOMAD
//FREELANCER MAX - 32