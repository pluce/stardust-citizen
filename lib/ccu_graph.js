
import { Graph, json, alg } from "@dagrejs/graphlib";
import graph_data from "../app/data/graph.json"
import graph_ccu from "../app/data/ccus.json"
import graph_ships from "../app/data/ships.json"

const graph = json.read(graph_data)

const CCUGraph = function() {
    return {
        getShips: () => {
            return graph_ships
        },
        getCCUs: () => {
            return graph_ccu
        },
        getCheapestCCUPath: (from, to, free_ccus) => {
            const distanceFn = (e) => {
                const ecid = `${e.v}-${e.w}-${e.name}`
                if(free_ccus && free_ccus.indexOf(ecid) > -1) {
                    return 0
                }
                return graph.edge(e).upgradePrice
            }

            const paths = alg.dijkstra(graph, from, distanceFn )
            if(!paths[to]) {
                return null
            }
            let it = paths[to]
            const total_ccu_price = it.distance
            const path = [to]
            const cost = []
            while(it.predecessor) {
                path.unshift(it.predecessor)
                const price = it.distance
                if(it.predecessor) {
                    it = paths[it.predecessor]
                    cost.unshift(price - it.distance)
                }
            }
            cost.unshift(0)
            
            const ccus = []
            for(let i in path) {
                i = parseInt(i)
                if( i < path.length - 1 ){
                    const fid = path[i]
                    const tid = path[i+1]
                    ccus.push(
                        graph.outEdges(fid, tid)
                            .map(e => graph.edge(e))
                            .filter(e => cost[i+1] == 0 || e.upgradePrice == cost[i+1])
                            .map(c => ({
                                ...c,
                                from: graph.node(fid),
                                to: graph.node(tid)
                            })
                        )[0]
                    )
                }
            }
            return {
                total_ccu_price,
                ccus
            }
        }
    }
}

export default (new CCUGraph())