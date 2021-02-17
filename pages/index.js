import { Box, Grid, Flex, Heading, Text, Link, Alert, AlertIcon, Center, Badge} from '@chakra-ui/react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ships from '../data/ships.json'
import SelectShip from '../app/SelectShip'
import CCUPath from '../app/CCUPath'
import Donate from '../app/Donate'

import { useEffect, useState } from 'react'

export default function Home() {
  const [startingShip, setStartingShip] = useState(null)
  const [targetShip, setTargetShip] = useState(null)
  const [ccuData, setCCUData] = useState(null)
  const [noCCUPath, setNoCCUPath] = useState(false)

  useEffect(async () => {
    if (startingShip && targetShip) {
      setNoCCUPath(false)
      setCCUData(null)
      const ccus = await fetch("api/ccus?" + new URLSearchParams({
        from: startingShip.id,
        to: targetShip.id,
      }))
      const data = await ccus.json()
      if(data.no_path) {
        setNoCCUPath(true)
      } else {
        setCCUData(data)
      }
    }
  }, [startingShip, targetShip])

  return (
    <>
      <Box p="10">
        <Heading colorScheme="teal">Welcome to the CCUs pathfinder</Heading>
        <Text fontSize="xl">
          Choose a starting ship, a target ship and you'll get the most money-efficient CCU path.
        </Text>
      </Box>
      <Flex
      >
        
          <SelectShip flex="1" w="100%" onSelect={setStartingShip} placeholder="Select a starting ship"/>
        
          <SelectShip flex="1" w="100%" onSelect={setTargetShip} placeholder="Select a target ship"/>
  
        </Flex>
        { noCCUPath &&
        <Box p={10}>
          <Alert status="error">
            <AlertIcon />
            Sadly we didn't find any CCU path between these ships 😢
          </Alert>
        </Box>
        }
        { ccuData && <CCUPath from={startingShip} to={targetShip} path={ccuData} />}
        <Box><Center>Made by <Link mr="1" ml="1" color="teal.500" href="https://robertsspaceindustries.com/citizens/pluce">pluce</Link> - If you like this you can <Donate/> or use my referral code <Badge ml="1" colorScheme="teal">STAR-22GV-7JVT</Badge></Center></Box>
    </>
  )
}
