import Layout from "@/components/Layout/Layout";
import {useAccount} from "wagmi";
import {Alert} from "@chakra-ui/react";
import ProposalForm from "@/components/Proposal/ProposalForm";
import {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";

export default function SubmitProposal() {
    const { isConnected } = useAccount();
    const [hasRole, setHasRole] = useState(false);
    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
    const getIsBrainer = useQuery(REQUEST.QUERY.ROLES.IS_BRAINER);
    const getIsFinder = useQuery(REQUEST.QUERY.ROLES.IS_FINDER);

    useEffect(() => {
        (async function() {
            if( isConnected ){
                if( getIsWise.data?.isWise || getIsBrainer.data?.isBrainer || getIsFinder.data?.isFinder )
                    setHasRole(true);
            }
        })();
    },[isConnected, getIsWise, getIsBrainer, getIsFinder])

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