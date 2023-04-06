import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading, SimpleGrid,
    Text
} from "@chakra-ui/react";
import {ethers} from "ethers";
import {useProvider} from "wagmi";
import {useEffect, useState} from "react";
import {abiDao, contractDaoAddress} from "@/constants";
import Link from "next/link";

const ListProjects = () => {
    const provider = useProvider()
    const contract = new ethers.Contract(contractDaoAddress, abiDao, provider);
    const [projects, setProjects] = useState();

    useEffect(() => {
        (async function() {
                let eventFilter = contract.filters.ProjectSubmitted();
                let events = await contract.queryFilter(eventFilter);

                let eventsArray = [];

                events.forEach(event => {
                    const daoId = ethers.BigNumber.from(event.args.id).toNumber();
                    eventsArray.push({'projectId': daoId, 'name': event.args.name, 'owner': event.args.owner})
                });

                setProjects(eventsArray);
        })();
    },[])

    const ListProjectsSubmitted = () => {
        if( projects?.length > 0 )
        {
            return projects.map( item => {
                return(
                    <Card key={item.projectId}>
                        <CardHeader>
                            <Heading size='md'>{item.name}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>{item.owner}</Text>
                        </CardBody>
                        <CardFooter>
                            <Button>
                                <Link
                                    href={{
                                        pathname: '/GetProject',
                                        query: {
                                            id: item.projectId
                                        }
                                    }}
                                >
                                    Details
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })
        }
    }

    return(
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            <ListProjectsSubmitted/>
        </SimpleGrid>
    )
}

export default ListProjects;