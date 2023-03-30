import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {useAccount} from "wagmi";

const Header = () => {
    const { address, isConnected } = useAccount()

    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            <Text fontWeight="bold">Logo</Text>
            <Flex width="30%" justifyContent="space-between" alignItems="center">
                <Text><Link href="/">Home</Link></Text>
                <Text><Link href="/submitProject">Submit Project</Link></Text>
            </Flex>
            <ConnectButton/>
        </Flex>
    )
}

export default Header;