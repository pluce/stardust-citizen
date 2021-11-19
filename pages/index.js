import { Box, Grid, Flex, Heading, Text, Link, Alert, AlertIcon, Center, Badge} from '@chakra-ui/react'
import SelectShip from '../app/SelectShip'
import CCUPath from '../app/CCUPath'
//import CCUGraph from '../app/CCUGraph'
import Donate from '../app/Donate'

import { useEffect, useState } from 'react'
import OwnCCU from '../app/OwnCCU'

export default function Home() {
  const [startingShip, setStartingShip] = useState(null)
  const [targetShip, setTargetShip] = useState(null)
  const [ccuData, setCCUData] = useState(null)
  const [noCCUPath, setNoCCUPath] = useState(false)
  const [customCCUs, setCustomCCUs] = useState([])
 // const [graphData, setGraphData] = useState(null)

  useEffect(async () => {
    if (startingShip && targetShip) {
      setNoCCUPath(false)
      setCCUData(null)
      const ccus = await fetch("api/path?" + new URLSearchParams({
        from: startingShip.id,
        to: targetShip.id,
        free_ccus: customCCUs
      }))
      const data = await ccus.json()
      if(data.ccus.length == 0) {
        setNoCCUPath(true)
      } else {
        setCCUData(data)
      }
    }
  }, [startingShip, targetShip, customCCUs])

  // useEffect(async () => {
  //   const ccus = await fetch("api/all")
  //   const data = await ccus.json()
  //   setGraphData(data)
  // }, [])

  const onSelectCustomCCUs = (custom_ccus) => {
    setCustomCCUs(custom_ccus.map(x => `${x.from.id}-${x.to.id}-${x.id}`))
  }

  return (
    <>
      <Box pl="10" pr="10" pt="5">
        <OwnCCU onSelectChange={onSelectCustomCCUs}/>
        <Heading colorScheme="teal">Welcome to the CCUs pathfinder</Heading>
        <Text fontSize="xl">
          Choose a starting ship, a target ship and you'll get the most money-efficient CCU path.
        </Text>
        <Text fontSize="lg">
          You can also select some CCUs you already own by clicking on the button on the right. They'll count as $0 CCUs.
        </Text>
        <Text fontSize="lg">
          You can get a <Link href="/ccus" color="teal.500" >list of ships and CCUs there</Link>.
        </Text>
      </Box>
      <Box pl="10" pr="10">
      <Flex>
        
          <SelectShip flex="1" w="100%" onSelect={setStartingShip} placeholder="Select a starting ship"/>
        
          <SelectShip flex="1" w="100%" onSelect={setTargetShip} placeholder="Select a target ship"/>
  
        </Flex></Box>
      {/* { graphData && <Box pl="10" pr="10">
      <Flex>
        
          <CCUGraph flex="1" w="100%" data={graphData}/>
  
      </Flex></Box> } */}
        { noCCUPath &&
        <Box p={10}>
          <Alert status="error">
            <AlertIcon />
            Sadly we didn't find any CCU path between these ships 😢
          </Alert>
        </Box>
        }
        { ccuData && <CCUPath from={startingShip} to={targetShip} path={ccuData} customCCUs={customCCUs}/>}
        <Box><Center>All prices includes a 20% VAT<br/>Made by <Link mr="1" ml="1" color="teal.500" href="https://robertsspaceindustries.com/citizens/pluce">pluce</Link> - If you like this you can <Donate/> or use my referral code <Badge ml="1" colorScheme="teal">STAR-22GV-7JVT</Badge></Center></Box>
    </>
  )
}
