import {ethers} from "ethers";
import {abiDao, abiGovernance, contractDaoAddress, contractGovernanceAddress} from "@/constants";
import {useSearchParams} from "next/navigation";
import Layout from "@/components/Layout/Layout";
import {
    Box,
    Button, Container,
    Heading,
    List, ListItem, SimpleGrid, Spinner,
    Stack, Text,
    useColorModeValue, useToast
} from "@chakra-ui/react";
import {useAccount, useProvider, useSigner} from "wagmi";
import {useEffect, useState} from "react";


export default function ProposalDetail() {
    const searchParams = useSearchParams();
    let proposalId = searchParams.get('id');

    const { isConnected } = useAccount();
    const provider = useProvider()
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const toast = useToast();
    const [proposal, setProposal] = useState();
    const [voted, setVoted] = useState(false);
    const [hasRole, setHasRole] = useState(false);
    const [isValidated, setIsValidated] = useState(false);

    const submitWithdraw = async() => {
        try {
            const contract = new ethers.Contract(contractGovernanceAddress, abiGovernance, signer);

            let transaction = await contract.withdrawVote(proposalId);
            await transaction.wait();
            setVoted(false);

            toast({
                title: 'Congratulations',
                description: "Vote has been withdrawn !",
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

    const submitVote = async() => {
        try {
            const contract = new ethers.Contract(contractGovernanceAddress, abiGovernance, signer)

            let transaction = await contract.submitVote(proposalId);
            await transaction.wait();
            setVoted(true);

            contract.on("ProposalValidated", (to, amount, from) => {
                setIsValidated(true);
            });

            toast({
                title: 'Congratulations',
                description: "Vote has been submitted !",
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

    const VotedButtonUI = () => {
        if( hasRole )
        {
            if( voted )
            {
                return(
                    <Button colorScheme='teal' size='md' onClick={() => submitWithdraw()}>
                        Withdraw vote
                    </Button>
                )
            }
            else
            {
                return(
                    <Button colorScheme='teal' size='md' onClick={() => submitVote()}>
                        Vote
                    </Button>
                )
            }
        }
    }

    useEffect(() => {
        (async function() {
            if( proposalId !== null )
            {
                const contract = new ethers.Contract(contractGovernanceAddress, abiGovernance, provider);
                let proposalFetch = await contract.getProposal(proposalId);
                setProposal(proposalFetch);
                setIsValidated(proposalFetch.validated)

                let hasVoted = false;
                let eventFilter = contract.filters.VoteSubmitted(address, proposalId);
                let events = await contract.queryFilter(eventFilter);
                events.forEach(event => {
                    hasVoted = event.args.voted;
                });

                setVoted(hasVoted);
            }
        })();
    },[proposalId])

    useEffect(() => {
        (async function() {
            if( isConnected ){
                const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                const roles = await contract.getRoles();
                if( roles.isFinder || roles.isBrainer || roles.isWise )
                    setHasRole(true);
            }
        })();
    },[isConnected])

    const gray = useColorModeValue('gray.900', 'gray.400');
    const yellow = useColorModeValue('yellow.500', 'yellow.300');

    return(
        <>
            { proposal != null ?
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
                                        {proposal.name}
                                    </Heading>
                                    <Text
                                        color={gray}
                                        fontWeight={300}
                                        fontSize={'2xl'}>
                                        {proposal.description}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text
                                        fontSize={{ base: '16px', lg: '18px' }}
                                        color={yellow}
                                        fontWeight={'500'}
                                        textTransform={'uppercase'}
                                        mb={'4'}>
                                        Proposal Details
                                    </Text>
                                    <List spacing={2}>
                                        <ListItem>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                Owner:
                                            </Text>{' '}
                                            {proposal?.owner}
                                        </ListItem>
                                        { isValidated ?
                                            (
                                                <ListItem>
                                                    <Text as={'span'} fontWeight={'bold'}>
                                                        Validated
                                                    </Text>
                                                </ListItem>
                                            )
                                            :
                                            (
                                                <VotedButtonUI/>
                                            )
                                        }
                                    </List>
                                </Box>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                )
                :
                <Spinner />
            }
        </>
    )

}