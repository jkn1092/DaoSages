import Layout from "@/components/Layout/Layout";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Stack,
    StackDivider,
    Text
} from "@chakra-ui/react";
import { useProvider} from "wagmi";
import {ethers} from "ethers";
import {abiGovernance, contractGovernanceAddress} from "@/constants";
import {useEffect, useState} from "react";
import Link from "next/link";


export default function getProposals() {
    const provider = useProvider()
    const [proposals, setProposals] = useState();


    useEffect(() => {
        (async function() {
            const contract = new ethers.Contract(contractGovernanceAddress, abiGovernance, provider);
            let eventFilter = contract.filters.ProposalSubmitted();
            let events = await contract.queryFilter(eventFilter);

            let eventsArray = [];

            events.forEach(event => {
                const proposalId = ethers.BigNumber.from(event.args.id).toNumber();
                eventsArray.push({'proposalId': proposalId, 'name': event.args.name,
                    'description': event.args.description,'owner': event.args.owner})
            });

            setProposals(eventsArray);
        })();
    },[])

    const ListProposalsSubmitted = () => {
        if( proposals?.length > 0 )
        {
            return proposals.map( item => {
                return(
                    <Card key={item.proposalId}>
                        <CardHeader>
                            <Heading size='md'>{item.name}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                        Description
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                        {item.description}
                                    </Text>
                                </Box>
                            </Stack>
                        </CardBody>
                        <CardFooter>
                             <Button>
                                 <Link
                                     href={{
                                         pathname: '/getProposal',
                                         query: {
                                             id: item.proposalId
                                         }
                                     }}
                                 >
                                     Details
                                 </Link>
                             </Button>
                        </CardFooter>
                    </Card>
                )
            })
        }
    }

    return(
        <Layout>
            <ListProposalsSubmitted/>
        </Layout>
    );
}