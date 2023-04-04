import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {useAccount, useProvider, useSigner} from "wagmi";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abi, contractAddress} from "@/constants";

const Header = () => {
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const [isFinder, setIsFinder] = useState(false);
    const [isBrainer, setIsBrainer] = useState(false);
    const [isWise, setIsWise] = useState(false);

    useEffect(() => {
        (async function() {
            if( isConnected ){
                const contract = new ethers.Contract(contractAddress, abi, signer);
                const roles = await contract.getRoles();
                setIsFinder(roles.isFinder);
                setIsBrainer(roles.isBrainer);
                setIsWise(roles.isWise);
            }
        })();
    },[isConnected])

    const FinderMenu = () => {
        if( isFinder || isWise )
        {
            return(
                <>
                    <Text><Link href="/submitProject">Submit Project</Link></Text>
                    <Text><Link href="/submitProposal">Submit Proposal</Link></Text>
                </>
            )
        }
    }

    const BrainerMenu = () => {
        if( isFinder || isWise )
        {
            return(
                <>
                    <Text><Link href="/">Projects</Link></Text>
                    <Text><Link href="/submitProposal">Submit Proposal</Link></Text>
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
                            <Text><Link href="/profile">Profile</Link></Text>
                            <FinderMenu/>
                            <Text><Link href="/getProposals">Proposals</Link></Text>
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