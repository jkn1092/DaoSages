import Layout from "@/components/Layout/Layout";
import {Alert} from "@chakra-ui/react";
import {useAccount} from "wagmi";
import ProposalDetail from "@/components/Proposal/ProposalDetail";

export default function GetProposal() {

    const { isConnected } = useAccount();

    return(
        <Layout>
            { isConnected ?
                <ProposalDetail/>
                :
                <Alert status='warning' width="50%">
                    Please, connect your Wallet!
                </Alert>
            }
        </Layout>
    )

}