import React, { useState } from 'react'
import { Select, Box, Image, List, ListItem, Badge } from '@chakra-ui/react'
import { NotAllowedIcon} from '@chakra-ui/icons'
import ships from '../data/ships.json'

function SelectShip(props) {
    const [selectedShip, selectShip] = useState(null)
    const onSelect = (e) => {
        const ship_id = e.target.value
        const ship = ships.find(x => x.id == ship_id)
        selectShip(ship)
        props.onSelect && props.onSelect(ship)
    }
    return (
    <Box w="100%" p="10" verticalAlign="top">
        <Select variant="flushed" colorScheme="teal" placeholder={props.placeholder || "Choose a ship"} onChange={onSelect}>
            { ships.sort((a,b) => a.name.localeCompare(b.name) ).map(ship => {
                return <option value={ship.id} key={ship.id}>{ship.name}</option>
            })}
        </Select>
        {selectedShip && <Image src={selectedShip.medias.slideShow}/>}
        {selectedShip && selectedShip.skus && 
        <List spacing={3} p={5}>
        <ListItem>
            <b>Current ship price:</b>
        </ListItem>
            { selectedShip.skus.map(sku => {
                return  (
                <ListItem>
                    <Badge ml="1" colorScheme="teal">${sku.price / 100}</Badge> {sku.title}
                    { (!sku.available || (!sku.unlimitedStock && !sku.availableStock)) && <Badge ml="1" colorScheme="red"><NotAllowedIcon/> not available</Badge>}
                </ListItem>
                )
            })}
            {selectedShip && selectedShip.skus.length == 0 && <ListItem><NotAllowedIcon color="red.500"/> Ship is currently not available</ListItem> }
            
        </List>
        }
    </Box>
    )
}
export default SelectShip