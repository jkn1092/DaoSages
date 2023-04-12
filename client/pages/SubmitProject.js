import Layout from "@/components/Layout/Layout";
import ProjectForm from "@/components/Project/ProjectForm";
import {useAccount, useSigner} from "wagmi";
import {useEffect, useState} from "react";
import {Alert} from "@chakra-ui/react";
import {useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import {rolesReactive} from "@/models/service";

export default function SubmitProject() {
    const { data: signer } = useSigner();
    const { isConnected, address } = useAccount();
    const [hasRole, setHasRole] = useState(false);
    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
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

                if( getIsWise.data?.isWise || getIsFinder.data?.isFinder )
                    setHasRole(true);
                else
                    setHasRole( false);
            }
        })();
    },[isConnected,getIsWise,getIsFinder])

    const ShowProjectForm = () => {
        if( hasRole ){
            return(
                <ProjectForm/>
            )
        }
        else
        {
            return(
                <Alert status='warning' width="50%">
                    Please, mint your Finder Role!
                </Alert>
            )
        }
    }

    return(
        <Layout>
            { isConnected ?
                <ShowProjectForm/>
                :
                <Alert status='warning' width="50%">
                    Please, connect your Wallet!
                </Alert>
            }
        </Layout>
    )
}