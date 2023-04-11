import {useAccount, useSigner} from "wagmi";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import {Box, Button, Center, Stack, Text, useColorModeValue, useToast} from "@chakra-ui/react";
import Image from "next/image";
import axios from "axios";
import {useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";

const NFTs = () => {
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const toast = useToast();

    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
    const getIsBrainer = useQuery(REQUEST.QUERY.ROLES.IS_BRAINER);
    const getIsFinder = useQuery(REQUEST.QUERY.ROLES.IS_FINDER);

    const [isFinder, setIsFinder] = useState();
    const [isBrainer, setIsBrainer] = useState();
    const [isWise, setIsWise] = useState();

    useEffect(() => {
        (async function() {
            if( signer )
            {
                const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                if (getIsFinder.data?.isFinder) {
                    const tokenURI = await contract.tokenFinderURI();
                    let response = await axios.get(tokenURI)
                    setIsFinder(response.data.image);
                }
                if (getIsBrainer.data?.isBrainer) {
                    const tokenURI = await contract.tokenBrainerURI();
                    let response = await axios.get(tokenURI)
                    setIsBrainer(response.data.image);
                }
                if (getIsWise.data?.isWise) {
                    const tokenURI = await contract.tokenWiseURI();
                    let response = await axios.get(tokenURI)
                    setIsWise(response.data.image);
                }
            }
        })();
    },[signer])

    const white = useColorModeValue('white', 'gray.800')

    const MintFinderDisplay = () => {
        if( isFinder )
        {
            const nftMinted = isFinder;
            return(
                <Center py={12}>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'330px'}
                        w={'full'}
                        bg={white}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'lg'}
                            mt={-12}
                            pos={'relative'}
                            height={'230px'}
                            _after={{
                                transition: 'all .3s ease',
                                content: '""',
                                w: 'full',
                                h: 'full',
                                pos: 'absolute',
                                top: 5,
                                left: 0,
                                backgroundImage: `url(${nftMinted})`,
                                filter: 'blur(15px)',
                                zIndex: -1,
                            }}
                            _groupHover={{
                                _after: {
                                    filter: 'blur(20px)',
                                },
                            }}>
                            <Image
                                rounded={'lg'}
                                height={230}
                                width={282}
                                objectFit={'cover'}
                                src={nftMinted}
                                alt="NFT Minted"
                            />
                        </Box>
                        <Stack pt={10} align={'center'}>
                            <Text textTransform={'uppercase'}>
                                <Button colorScheme='teal' isDisabled={true}>Minted Finder</Button>
                            </Text>
                        </Stack>
                    </Box>
                </Center>
            )
        }
        else
        {
            return(
                <Button colorScheme='teal' onClick={() => mintFinder()}>Mint Finder</Button>
            )
        }
    }

    const MintBrainerDisplay = () => {
        if( isBrainer )
        {
            const nftMinted = isBrainer;
            return(
                <Center py={12}>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'330px'}
                        w={'full'}
                        bg={white}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'lg'}
                            mt={-12}
                            pos={'relative'}
                            height={'230px'}
                            _after={{
                                transition: 'all .3s ease',
                                content: '""',
                                w: 'full',
                                h: 'full',
                                pos: 'absolute',
                                top: 5,
                                left: 0,
                                backgroundImage: `url(${nftMinted})`,
                                filter: 'blur(15px)',
                                zIndex: -1,
                            }}
                            _groupHover={{
                                _after: {
                                    filter: 'blur(20px)',
                                },
                            }}>
                            <Image
                                rounded={'lg'}
                                height={230}
                                width={282}
                                objectFit={'cover'}
                                src={nftMinted}
                                alt="NFT Minted"
                            />
                        </Box>
                        <Stack pt={10} align={'center'}>
                            <Text textTransform={'uppercase'}>
                                <Button colorScheme='teal' isDisabled={true}>Minted Brainer</Button>
                            </Text>
                        </Stack>
                    </Box>
                </Center>
            )
        }
        else
        {
            return(
                <Button colorScheme='teal' onClick={() => mintBrainer()}>Mint Brainer</Button>
            )
        }
    }

    const MintWiseDisplay = () => {
        if( isWise != null )
        {
            const nftMinted = isWise;
            return(
                <Center py={12}>
                    <Box
                        role={'group'}
                        p={6}
                        maxW={'330px'}
                        w={'full'}
                        bg={white}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        pos={'relative'}
                        zIndex={1}>
                        <Box
                            rounded={'lg'}
                            mt={-12}
                            pos={'relative'}
                            height={'230px'}
                            _after={{
                                transition: 'all .3s ease',
                                content: '""',
                                w: 'full',
                                h: 'full',
                                pos: 'absolute',
                                top: 5,
                                left: 0,
                                backgroundImage: `url(${nftMinted})`,
                                filter: 'blur(15px)',
                                zIndex: -1,
                            }}
                            _groupHover={{
                                _after: {
                                    filter: 'blur(20px)',
                                },
                            }}>
                            <Image
                                rounded={'lg'}
                                height={230}
                                width={282}
                                objectFit={'cover'}
                                src={nftMinted}
                                alt="NFT Minted"
                            />
                        </Box>
                        <Stack pt={10} align={'center'}>
                            <Text textTransform={'uppercase'}>
                                <Button colorScheme='teal' isDisabled={true}>Minted Wisemen</Button>
                            </Text>
                        </Stack>
                    </Box>
                </Center>
            )
        }
    }

    const mintFinder = async() => {
        try {
            let amountInEther = '0.01'
            const contract = new ethers.Contract(contractDaoAddress, abiDao, signer)
            let transaction = await contract.mintFinder(address, {value: ethers.utils.parseEther(amountInEther)});
            await transaction.wait();

            const tokenURI = await contract.tokenFinderURI();
            let response = await axios.get(tokenURI)
            setIsFinder(response.data.image);

            toast({
                title: 'Congratulations',
                description: "Minted successfully !",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
        catch(e) {
            toast({
                title: 'Error',
                description: "An error occured.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const mintBrainer = async() => {
        try {
            let amountInEther = '0.02'
            const contract = new ethers.Contract(contractDaoAddress, abiDao, signer)
            let transaction = await contract.mintBrainer(address, {value: ethers.utils.parseEther(amountInEther)});
            await transaction.wait();

            const tokenURI = await contract.tokenBrainerURI();
            let response = await axios.get(tokenURI)
            setIsBrainer(response.data.image);

            toast({
                title: 'Congratulations',
                description: "Minted successfully !",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
        catch(e) {
            toast({
                title: 'Error',
                description: "An error occured.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return(
        <Stack align="center" direction='row'>
            <MintFinderDisplay/>
            <Text>  </Text>
            <MintBrainerDisplay/>
            <Text>  </Text>
            <MintWiseDisplay/>
        </Stack>
    )
}

export default NFTs;