
import { useDisclosure, Button, Modal, ModalFooter, ModalBody, ModalContent, ModalHeader, ModalCloseButton, ModalOverlay } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import graph_ccu from "./data/ccus.json"

function OwnCCU(props) {
    const { onSelectChange } = props
    const [ ccuList, setCCUList ] = useState(null)
    const [ selectedCCUs, setSelectedCCUs ] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(async () => {
        setCCUList(graph_ccu)
        const saved_ccus = JSON.parse(localStorage.getItem("custom_ccus"))
        if(saved_ccus) {
            onSelect(saved_ccus)
        }
    }, [])

    const onSelect = (e) => {
        setSelectedCCUs(e)
        if (onSelectChange) {
            onSelectChange(e)
        }
        localStorage.setItem("custom_ccus", JSON.stringify(e))
    }

    return ccuList && (
        <>
            <Button colorScheme="teal" style={{float: "right"}}onClick={onOpen} m={4}>{selectedCCUs.length == 0 ? "Select your already owned CCUs" : `${selectedCCUs.length} selected CCUs`}</Button>
            <Modal onClose={onClose} size="xl" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Choose CCUs you already own.<br/>They'll count as $0 during path finding.</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Select
                    options={ccuList}
                    isMulti={true}
                    getOptionLabel={(x) => `${x.from.name} -> ${x.to.name} (${x.title})`}
                    getOptionValue={(x) => `${x.from.id}-${x.to.id}-${x.id}`}
                    defaultValue={selectedCCUs}
                    theme={ (theme) => ({
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
                        option: (provided,state) => ({
                            ...provided,
                            background: state.isSelected ? "white" : "#1A202C",
                            color: state.isSelected ? "black" : "white"
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            fontWeight: "700",
                            background: "rgba(129, 230, 217, 0.16)",
                        }),
                        multiValueLabel: (provided) => ({
                            ...provided,
                            background: "transparent",
                            color: "#81E6D9"
                        })
                    }}
                    onChange={onSelect}
                    />
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal> 
      </>
    )
}
export default OwnCCU