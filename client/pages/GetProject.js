import Layout from "@/components/Layout/Layout";
import {useAccount} from "wagmi";
import {Alert} from "@chakra-ui/react";
import ProjectDetail from "@/components/Project/ProjectDetail";

export default function GetProject() {

    const { isConnected } = useAccount();

    return(
        <Layout>
            { isConnected ?
                <ProjectDetail/>
                :
                <Alert status='warning' width="50%">
                    Please, connect your Wallet!
                </Alert>
            }
        </Layout>
    );
}