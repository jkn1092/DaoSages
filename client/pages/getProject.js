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
    StackDivider,
    VStack,
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
import {abi, contractAddress} from "@/constants";
import Layout from "@/components/Layout/Layout";

export default function getProject() {
    const searchParams = useSearchParams();
    let projectId = searchParams.get('id');
    const { data: signer } = useSigner();

    const { address, isConnected } = useAccount();
    const provider = useProvider()

    const toast = useToast();
    const [audit, setAudit] = useState();

    const getProjectResult = useQuery(REQUEST.QUERY.PROJECT.GET_PROJECT_ID,{
        variables: {
            daoId: projectId,
        },
    });

    const projectFetched = getProjectResult?.data?.project || null;

    const submitAudit = async() => {
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            let transaction = await contract.vote(projectId, audit);
            transaction.wait();

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
            console.log(e)
        }
    }

    useEffect(() => {
        (async function() {
            const contract = new ethers.Contract(contractAddress, abi, provider);
            let eventFilter = contract.filters.VoteSubmitted();
            let events = await contract.queryFilter(eventFilter);

            let grade = audit;
            events.forEach(event => {
                const daoId = ethers.BigNumber.from(event.args.projectId).toNumber();
                if( daoId === parseInt(projectId) ){
                    grade = event.args.grade;
                }
            });
            setAudit(grade);;
        })();
    },[projectId])

    const AuditInput = () => {
        if( projectId !== null )
        {
            return(
                <NumberInput defaultValue={audit} min={0} max={10} onChange={(value) => setAudit(value)}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            )
        }
    }

    return(
        <Layout>
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
                                        color={useColorModeValue('gray.900', 'gray.400')}
                                        fontWeight={300}
                                        fontSize={'2xl'}>
                                        {projectFetched?.description}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontSize={{ base: '16px', lg: '18px' }}
                                        color={useColorModeValue('yellow.500', 'yellow.300')}
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
                                    </List>
                                </Box>
                                <AuditInput/>
                                <Button colorScheme='teal' size='md' onClick={() => submitAudit()}>
                                    Audit
                                </Button>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                )
                :
                <Spinner />
            }
        </Layout>
    );
}