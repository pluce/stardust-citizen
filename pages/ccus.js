import { Box } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/table"
import { Badge } from '@chakra-ui/react'
import graph_ccu from "../app/data/ccus.json"
import graph_ships from "../app/data/ships.json"

export default function CCUList() {
    const mapping = {}
    graph_ccu.forEach(ccu => {
        mapping[ccu.from.id] = mapping[ccu.from.id] || []
        mapping[ccu.from.id].push(ccu)
    })
    return (
        <Box pl="10" pr="10" pt="5">
          <Table size="sm">
                <Thead>
                    <Th>From ship</Th>
                    <Th>To ship</Th>
                    <Th>CCU edition</Th>
                </Thead>
                <Tbody>
                { graph_ships
                    .filter(ship => ship.id != 0)
                    .map(ship => (mapping[ship.id]?.map(ccu => <Tr key={ccu.id}>
                        { (mapping[ship.id][0]?.id == ccu.id) && <Td style={{verticalAlign: "top", fontSize: "18px", fontWeight: "bold"}} rowSpan={mapping[ship.id].length}>{ship.name}</Td> }
                        <Td>{ccu.to.name}</Td>
                        <Td>{ccu.title} <Badge ml="1" colorScheme="teal">${ccu.price / 100}</Badge></Td>
                    </Tr>)))}
              </Tbody>
          </Table>
        </Box>
    )
}