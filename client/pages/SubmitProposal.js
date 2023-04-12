import Layout from "@/components/Layout/Layout";
import {useAccount, useSigner} from "wagmi";
import {Alert} from "@chakra-ui/react";
import ProposalForm from "@/components/Proposal/ProposalForm";
import {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import {rolesReactive} from "@/models/service";

export default function SubmitProposal() {
    const { data: signer } = useSigner();
    const { isConnected, address } = useAccount();
    const [hasRole, setHasRole] = useState(false);
    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
    const getIsBrainer = useQuery(REQUEST.QUERY.ROLES.IS_BRAINER);
    const getIsFinder = useQuery(REQUEST.QUERY.ROLES.IS_FINDER);
    const getAddressResult = useQuery(REQUEST.QUERY.ROLES.GET_ADDRESS);

    useEffect(() => {
        (async function() {
            if( isConnected ){
                if( signer != null && address !== getAddressResult?.data.getAddress ) {
                    const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                    const roles = await contract.getRoles();

                    await rolesReactive(address, roles.isFinder, roles.isBrainer, roles.isWise);
                }

                if( getIsWise.data?.isWise || getIsBrainer.data?.isBrainer || getIsFinder.data?.isFinder )
                    setHasRole(true);
                else
                    setHasRole(false);
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