import {useEffect, useState} from "react";
import {
    Heading,
    Spinner,
    Text,
    Box,
    useColorModeValue,
    Stack,
    Container,
    SimpleGrid,
    List,
    ListItem,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputStepper, Button, useToast
} from "@chakra-ui/react";
import { useSearchParams } from 'next/navigation'
import {REQUEST} from "@/services/graphql";
import {useQuery} from "@apollo/client";
import {useAccount, useProvider, useSigner} from "wagmi";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import {rolesReactive} from "@/models/service";

export default function ProjectDetail() {
    const searchParams = useSearchParams();
    let projectId = searchParams.get('id');

    const provider = useProvider()
    const { data: signer } = useSigner();
    const { address, isConnected } = useAccount();
    const toast = useToast();
    const [daoAudit, setDaoAudit] = useState();
    const [audit, setAudit] = useState();
    const [hasRole, setHasRole] = useState(false);
    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
    const getIsBrainer = useQuery(REQUEST.QUERY.ROLES.IS_BRAINER);
    const getAddressResult = useQuery(REQUEST.QUERY.ROLES.GET_ADDRESS);

    const getProjectResult = useQuery(REQUEST.QUERY.PROJECT.GET_PROJECT_ID,{
        variables: {
            daoId: projectId,
        },
    });

    const getCoinGeckoResult = useQuery(REQUEST.QUERY.PROJECT.GET_COIN_GECKO,{
        variables: {
            daoId: projectId,
        },
    });

    const projectFetched = getProjectResult?.data?.project || null;
    const coinGeckoFetched = getCoinGeckoResult?.data?.coinGecko || null;

    const submitAudit = async() => {
        try {
            const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
            let transaction = await contract.auditProject(projectId, audit);
            await transaction.wait();

            const result = await contract.getAudit(projectId);
            setDaoAudit(ethers.BigNumber.from(result).toNumber());

            toast({
                title: 'Congratulations',
                description: "Your vote has been submitted !",
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

    useEffect(() => {
        (async function() {
            if( projectId !== null )
            {
                let grade;
                const contract = new ethers.Contract(contractDaoAddress, abiDao, provider);
                let eventFilter = contract.filters.AuditSubmitted(address, projectId);
                let events = await contract.queryFilter(eventFilter);
                events.forEach(event => {
                    grade = event.args.grade;
                });
                setAudit(grade);

                const result = await contract.getAudit(projectId);
                setDaoAudit(ethers.BigNumber.from(result).toNumber());
            }

        })();
    },[projectId, address])

    useEffect(() => {
        (async function() {
            if( isConnected ){
                if( signer != null && address !== getAddressResult?.data.getAddress ) {
                    const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                    const roles = await contract.getRoles();

                    await rolesReactive(address, roles.isFinder, roles.isBrainer, roles.isWise);
                    if( roles.isWise || roles.isBrainer )
                        setHasRole(true);
                    else
                        setHasRole(false )
                }
                else
                {
                    if( getIsWise.data?.isWise || getIsBrainer.data?.isBrainer )
                        setHasRole(true);
                    else
                        setHasRole(false )
                }
            }
        })();
    },[isConnected, address, signer])


    const CoinGeckoInput = () => {
        if( coinGeckoFetched !== null )
        {
            return(
                <>
                    <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            CoinGecko Rank:
                        </Text>{' '}
                        {coinGeckoFetched.coingecko_rank}
                    </ListItem>
                    <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            CoinGecko Score:
                        </Text>{' '}
                        {coinGeckoFetched.coingecko_score}
                    </ListItem>
                    <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            Developer Score:
                        </Text>{' '}
                        {coinGeckoFetched.developer_score}
                    </ListItem>
                    <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            Community Score:
                        </Text>{' '}
                        {coinGeckoFetched.community_score}
                    </ListItem>
                    <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            Liquidity Score:
                        </Text>{' '}
                        {coinGeckoFetched.liquidity_score}
                    </ListItem>
                </>
            )
        }
    }

    const AuditInput = () => {
        if( projectId !== null && hasRole )
        {
            return(
                <>
                    <NumberInput defaultValue={audit} min={0} max={10} onChange={(value) => setAudit(value)}>
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Button colorScheme='teal' size='md' onClick={() => submitAudit()}>
                        Audit
                    </Button>
                </>
            )
        }
    }

    const gray = useColorModeValue('gray.900', 'gray.400');
    const yellow = useColorModeValue('yellow.500', 'yellow.300');

    return(
        <>
            { projectFetched != null ?
                (
                    <Container maxW={'7xl'}>
                        <SimpleGrid
                            columns={{ base: 1, lg: 2 }}
                            spacing={{ base: 8, md: 10 }}
                            py={{ base: 18, md: 24 }}>
                            <Stack spacing={{ base: 6, md: 10 }}>
                                <Box as={'header'}>
                                    <Heading
                                        lineHeight={1.1}
                                        fontWeight={600}
                                        fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                                        Project {projectFetched.name}
                                    </Heading>
                                    <Text
                                        color={gray}
                                        fontWeight={300}
                                        fontSize={'2xl'}>
                                        {projectFetched?.description}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontSize={{ base: '16px', lg: '18px' }}
                                        color={yellow}
                                        fontWeight={'500'}
                                        textTransform={'uppercase'}
                                        mb={'4'}>
                                        Project Details
                                    </Text>

                                    <List spacing={2}>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                Token:
                                            </Text>{' '}
                                            {projectFetched?.token}
                                        </ListItem>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                Social media:
                                            </Text>{' '}
                                            {projectFetched?.socialMedia}
                                        </ListItem>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                Code source:
                                            </Text>{' '}
                                            {projectFetched?.codeSource}
                                        </ListItem>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                Email:
                                            </Text>{' '}
                                            {projectFetched?.email}
                                        </ListItem>
                                        <CoinGeckoInput/>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                DAO Audit:
                                            </Text>{' '}
                                            {daoAudit}
                                        </ListItem>
                                    </List>
                                </Box>
                                <AuditInput/>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                )
                :
                <Spinner />
            }
        </>
    );
}