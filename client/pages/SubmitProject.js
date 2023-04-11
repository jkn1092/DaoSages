import Layout from "@/components/Layout/Layout";
import ProjectForm from "@/components/Project/ProjectForm";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {Alert} from "@chakra-ui/react";
import {useQuery} from "@apollo/client";
import {REQUEST} from "@/services/graphql";

export default function SubmitProject() {
    const { isConnected } = useAccount();
    const [hasRole, setHasRole] = useState(false);
    const getIsWise = useQuery(REQUEST.QUERY.ROLES.IS_WISE);
    const getIsFinder = useQuery(REQUEST.QUERY.ROLES.IS_FINDER);

    useEffect(() => {
        (async function() {
            if( isConnected ){
                if( getIsWise.data?.isWise || getIsFinder.data?.isFinder )
                    setHasRole(true);
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