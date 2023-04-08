import Head from 'next/head'
import {useAccount, useSigner} from "wagmi";
import Layout from "@/components/Layout/Layout";
import {Alert, AlertIcon, Button, Flex, Heading, Stack, Text, Image, useBreakpointValue} from "@chakra-ui/react";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import Link from "next/link";
import {useEffect, useState} from "react";
import RoleCarousel from "@/components/Home/RoleCarousel";
import RoadMap from "@/components/Home/RoadMap";

export default function Home() {

    const { data: signer } = useSigner();
    const { address, isConnected } = useAccount()
    const [isFinder, setIsFinder] = useState(false);
    const [isBrainer, setIsBrainer] = useState(false);
    const [isWise, setIsWise] = useState(false);

    useEffect(() => {
        (async function() {
            if( isConnected ){
                const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                const roles = await contract.getRoles();
                setIsFinder(roles.isFinder);
                setIsBrainer(roles.isBrainer);
                setIsWise(roles.isWise);
            }
        })();
    },[isConnected])

    const FinderButton = () => {
        if( isFinder || isWise )
        {
            return(
                <>
                    <Button
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}>
                        <Link href="/SubmitProject">
                            Submit Project
                        </Link>
                    </Button>
                </>
            )
        }
    }

    const AuditButton = () => {
        if( isBrainer || isWise )
        {
            return(
                <>
                    <Button
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}>
                        <Link href="/GetProjects">
                        Audit Project
                        </Link>
                    </Button>
                </>
            )
        }
    }

  return (
    <>
      <Head>
        <title>DAO des Sages</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
          <Stack minH={'50vh'} maxH={'100vh'} direction={{ base: 'column', md: 'row' }}>
              <Flex p={8} flex={1} align={'center'} justify={'center'}>
                  <Stack spacing={6} w={'full'} maxW={'lg'}>
                      <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                          <Text
                              as={'span'}
                              position={'relative'}
                              _after={{
                                  content: "''",
                                  width: 'full',
                                  height: useBreakpointValue({ base: '20%', md: '30%' }),
                                  position: 'absolute',
                                  bottom: 1,
                                  left: 0,
                                  bg: 'blue.400',
                                  zIndex: -1,
                              }}>
                              DAO des Sages
                          </Text>
                          <br />{' '}
                          <Text color={'blue.400'} as={'span'}>
                              Audit Projects
                          </Text>{' '}
                      </Heading>
                      <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
                          A DAO for auditing blockchain project with a transparent and automated process that verifies
                          the accuracy and integrity of the projects transactions and data.
                      </Text>
                      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                          <FinderButton/>
                          <AuditButton/>
                          <Button rounded={'full'}>
                              <Link href="/HowItWorks">
                                  How It Works
                              </Link>
                          </Button>
                      </Stack>
                  </Stack>
              </Flex>
              <Flex flex={1}>
                  <Image
                      alt={'Login Image'}
                      objectFit={'cover'}
                      src={
                          'https://images.pexels.com/photos/7887812/pexels-photo-7887812.jpeg'
                      }
                  />
              </Flex>
          </Stack>
        <RoleCarousel/>
        <RoadMap/>
      </Layout>
    </>
  )
}
