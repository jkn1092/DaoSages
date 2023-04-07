import ListProjects from "@/components/Project/ListProjects";
import Layout from "@/components/Layout/Layout";
import {useAccount} from "wagmi";
import {Alert} from "@chakra-ui/react";

export default function GetProjects() {

    const { isConnected } = useAccount();

    return(
        <Layout>
            { isConnected ?
                <ListProjects/>
                :
                <Alert status='warning' width="50%">
                    Please, connect your Wallet!
                </Alert>
            }
        </Layout>
    )
}