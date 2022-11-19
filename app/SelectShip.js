import React, { useState, useEffect } from 'react'
import { Box, Image, List, ListItem, Badge } from '@chakra-ui/react'
import { NotAllowedIcon } from '@chakra-ui/icons'
import Select from 'react-select'
import graph_ships from "./data/ships.json"


function SelectShip(props) {
    const [shipList, setShipList] = useState(null)
    const [selectedShip, selectShip] = useState(null)

    useEffect(async () => {
        setShipList(graph_ships)
    }, [])

    const onSelect = (ship) => {
        selectShip(ship)
        props.onSelect && props.onSelect(ship)
    }
    return shipList && (
        <Box w="100%" p="10" verticalAlign="top">
            {shipList && <Select
                options={shipList}
                getOptionLabel={(x) => x.name}
                getOptionValue={(x) => x.id}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        neutral0: '#1A202C',
                        neutral80: "white",
                        neutral90: "white",
                        primary25: 'rgba(129, 230, 217, 0.16)',
                        primary: 'black',
                    }
                })
                }
                styles={{
                    option: (provided, state) => ({
                        ...provided,
                        background: state.isSelected ? "white" : "#1A202C",
                        color: state.isSelected ? "black" : "white"
                    })
                }}
                onChange={onSelect}
            />}
            {selectedShip && <Image src={selectedShip.medias.slideShow} />}
            {selectedShip && selectedShip.skus &&
                <List spacing={3} p={5}>
                    <ListItem>
                        <b>Current ship price:</b>
                    </ListItem>
                    {selectedShip.skus.map(sku => {
                        return (
                            <ListItem key={sku.id}>
                                <Badge ml="1" colorScheme="teal">${sku.price / 100}</Badge> {sku.title}
                                {(!sku.available || (!sku.unlimitedStock && !sku.availableStock)) && <Badge ml="1" colorScheme="red"><NotAllowedIcon /> not available</Badge>}
                            </ListItem>
                        )
                    })}
                    {selectedShip && selectedShip.skus.length == 0 && <ListItem><NotAllowedIcon color="red.500" /> Ship is currently not available</ListItem>}

                </List>
            }
        </Box>
    )
}
export default SelectShip