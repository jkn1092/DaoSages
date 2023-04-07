import Layout from "@/components/Layout/Layout";
import {useAccount, useSigner} from "wagmi";
import ListProposals from "@/components/Proposal/ListProposals";
import {Alert} from "@chakra-ui/react";
import ProposalForm from "@/components/Proposal/ProposalForm";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";

export default function SubmitProposal() {
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const [hasRole, setHasRole] = useState(false);

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

    const ShowProposalForm = () => {
        if( hasRole ){
            return(
                    <ProposalForm/>
            )
        }
        else
        {
            return(
                <Alert status='warning' width="50%">
                    Please, mint your Role!
                </Alert>
            )
        }
    }

    return(
        <Layout>
            { isConnected ?
                <ShowProposalForm/>
                :
                <Alert status='warning' width="50%">
                    Please, connect your Wallet!
                </Alert>
            }
        </Layout>
    )
}