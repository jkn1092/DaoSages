import Layout from "@/components/Layout/Layout";
import { Alert } from "@chakra-ui/react";
import {useAccount} from "wagmi";
import ListProposals from "@/components/Proposal/ListProposals";


export default function GetProposals() {

    const { isConnected } = useAccount();

    return(
        <Layout>
            { isConnected ?
                <ListProposals/>
                :
                <Alert status='warning' width="50%">
                    Please, connect your Wallet!
                </Alert>
            }
        </Layout>
    );
}