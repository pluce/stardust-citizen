import React, {useState, useEffect} from 'react'
import ReactFlow, {isNode} from 'react-flow-renderer';
  import { Box, Grid, Flex, Heading, Text, Link, Alert, AlertIcon, Center, Badge} from '@chakra-ui/react'


const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};


function CCUGraph(props) {
    
    const [elements, setElements] = useState(props.data);

    return (
        <Box flex="1" w="100%" h="800px">
            <ReactFlow
                elements={elements}
                onLoad={onLoad}
            >
            </ReactFlow>
        </Box>
    )
}

export default CCUGraph