import { Flex, Text } from '@chakra-ui/react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {useLazyQuery, useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";
import {useEffect} from "react";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import {useAccount, useSigner} from "wagmi";
import {get} from "axios";
import {rolesReactive} from "@/models/service";

const Layout = ({ children }) => {

    const { data: signer } = useSigner();
    const { address } = useAccount();
    const getAddressResult = useQuery(REQUEST.QUERY.ROLES.GET_ADDRESS);

    useEffect(() => {
        (async function() {
            if( address !== getAddressResult?.data) {
                console.log(getAddressResult);
                console.log("Need to set address = " + address);

                const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                const roles = await contract.getRoles();

                rolesReactive(address, roles.isFinder, roles.isBrainer, roles.isWise);
            }
            else
            {
                console.log("Test :" + getAddressResult?.data);
            }

        })();
    },[address])


    return (
        <Flex justifyContent="space-between" alignItems="center" direction="column">
            <Header />
            {children}
            <Footer />
        </Flex>
    )
}

export default Layout;