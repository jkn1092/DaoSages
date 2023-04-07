import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {useAccount, useProvider, useSigner} from "wagmi";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";

const Header = () => {
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
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

    const FinderMenu = () => {
        if( isFinder )
        {
            return(
                <>
                    <Text><Link href="/SubmitProject">Submit Project</Link></Text>
                    <Text><Link href="/SubmitProposal">Submit Proposal</Link></Text>
                </>
            )
        }
    }

    const BrainerMenu = () => {
        if( isBrainer )
        {
            return(
                <>
                    <Text><Link href="/GetProjects">Projects</Link></Text>
                    <Text><Link href="/SubmitProposal">Submit Proposal</Link></Text>
                </>
            )
        }
    }

    const WiseMenu = () => {
        if( isWise )
        {
            return(
                <>
                    <Text><Link href="/SubmitProject">Submit Project</Link></Text>
                    <Text><Link href="/GetProjects">Projects</Link></Text>
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
                { isConnected ?
                    (
                        <>
                            <Text><Link href="/Profile">Profile</Link></Text>
                            <FinderMenu/>
                            <BrainerMenu/>
                            <WiseMenu/>
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