import {useAccount, useProvider, useSigner} from "wagmi";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abi, contractAddress} from "@/constants";
import {Box, Button, Center, Heading, Stack, Text, useColorModeValue, useToast} from "@chakra-ui/react";
import Image from "next/image";
import axios from "axios";


const NFTs = () => {
    const provider = useProvider()

    const { data: signer } = useSigner();
    const { address } = useAccount();
    const toast = useToast();

    const [isFinder, setIsFinder] = useState();
    const [isBrainer, setIsBrainer] = useState();
    const [isWise, setIsWise] = useState();

    const IMAGE =
        'https://gateway.pinata.cloud/ipfs/QmcXfse4roevf8hZu1C27kaFnV4DuvJwKLGQx1MTrc2kKA/finder.png';

    useEffect(() => {
        (async function() {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const roles = await contract.getRoles();
            if( roles.isFinder )
            {
                const tokenURI = await contract.tokenFinderURI();
                let response = await axios.get(tokenURI)
                setIsFinder(response.data.image);
            }
            if( roles.isBrainer )
            {
                const tokenURI = await contract.tokenBrainerURI();
                let response = await axios.get(tokenURI)
                setIsBrainer(response.data.image);
            }
            if( roles.isWise )
            {
                const tokenURI = await contract.tokenWiseURI();
                let response = await axios.get(tokenURI)
                setIsWise(response.data.image);
            }

        })();
    },[provider])

    const MintFinder = () => {
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
                        bg={useColorModeValue('white', 'gray.800')}
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
                                <Button colorScheme='teal' isDisabled={true}>Minted</Button>
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

    const MintBrainer = () => {
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
                        bg={useColorModeValue('white', 'gray.800')}
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
                                <Button colorScheme='teal' isDisabled={true}>Minted</Button>
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

    const MintWise = () => {
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
                        bg={useColorModeValue('white', 'gray.800')}
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
                                <Button colorScheme='teal' isDisabled={true}>Minted</Button>
                            </Text>
                        </Stack>
                    </Box>
                </Center>
            )
        }
    }

    const mintFinder = async() => {
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer)
            await contract.mintFinder(address);

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
            const contract = new ethers.Contract(contractAddress, abi, signer)
            await contract.mintBrainer(address);

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
        <>
            <MintFinder/>
            <MintBrainer/>
            <MintWise/>
        </>
    )
}

export default NFTs;