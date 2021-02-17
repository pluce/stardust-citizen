import React, { useState } from 'react'
import { Select, Box, Image, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge} from '@chakra-ui/react'
import ships from '../data/ships.json'

function CCUPath(props) {
    const { from, to, path } = props
    const { total_ccu_price, ccus } = path
    return (
    <Box p="10" verticalAlign="top">
       <Heading size="lg">Cheapest path from {from.name} to {to.name}: <Badge fontSize="xl" colorScheme="teal">${total_ccu_price / 100}</Badge></Heading>
       <Box p="5">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th>Cost</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { ccus.map(ccu => {
                        return (
                        <Tr>
                            <Td pl="110px" bg={`center left / contain no-repeat url('${ccu.from.medias.slideShow}')`}>{ccu.from.name}</Td>
                            <Td pl="110px" bg={`center left / contain no-repeat url('${ccu.to.medias.slideShow}')`}>{ccu.to.name}</Td>
                            <Td isNumeric><Badge fontSize="lg" colorScheme="teal">${ccu.upgradePrice / 100}</Badge></Td>
                        </Tr>
                        )
                    })}
                    
                </Tbody>
            </Table>
        </Box>
    </Box>
    )
}
export default CCUPath