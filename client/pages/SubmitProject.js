import Layout from "@/components/Layout/Layout";
import ProjectForm from "@/components/Project/ProjectForm";
import {useAccount, useSigner} from "wagmi";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abiDao, contractDaoAddress} from "@/constants";
import {Alert} from "@chakra-ui/react";

export default function SubmitProject() {
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        (async function() {
            if( isConnected ){
                const contract = new ethers.Contract(contractDaoAddress, abiDao, signer);
                const roles = await contract.getRoles();
                if( roles.isFinder || roles.isWise )
                    setHasRole(true);
            }
        })();
    },[isConnected])

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