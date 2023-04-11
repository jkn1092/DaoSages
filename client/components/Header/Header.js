import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {useAccount} from "wagmi";
import {useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";

const Header = () => {
    const { isConnected } = useAccount();
    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
    const getIsBrainer = useQuery(REQUEST.QUERY.ROLES.IS_BRAINER);
    const getIsFinder = useQuery(REQUEST.QUERY.ROLES.IS_FINDER);

    const RoleMenu = () => {
        if( getIsWise.data?.isWise )
        {
            return(
                <>
                    <Text><Link href="/SubmitProject">Submit Project</Link></Text>
                    <Text>   </Text>
                    <Text><Link href="/SubmitProposal">Submit Proposal</Link></Text>
                </>
            )
        }
        else if( getIsFinder.data?.isFinder )
        {
            return(
                <>
                    <Text><Link href="/SubmitProject">Submit Project</Link></Text>
                    <Text>   </Text>
                    <Text><Link href="/SubmitProposal">Submit Proposal</Link></Text>
                </>
            )
        }
        else if( getIsBrainer.data?.isBrainer )
        {
            return(
                <>
                    <Text><Link href="/SubmitProposal">Submit Proposal</Link></Text>
                </>
            )
        }
    }

    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            <Text fontWeight="bold">DAO des Sages</Text>
            <Flex width="30%" justifyContent="space-between" alignItems="center">
                <Text><Link href="/">Home</Link></Text>
                <Text>   </Text>
               { isConnected ?
                    (
                        <>
                            <Text><Link href="/Profile">Profile</Link></Text>
                            <Text>  </Text>
                            <Text><Link href="/GetProjects">Projects</Link></Text>
                            <Text>  </Text>
                            <RoleMenu/>
                            <Text>   </Text>
                            <Text><Link href="/GetProposals">Proposals</Link></Text>
                        </>
                    )
                    :
                    <></>
                }
            </Flex>
            <ConnectButton/>
        </Flex>
    )
}

export default Header;