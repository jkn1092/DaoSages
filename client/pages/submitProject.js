import Head from 'next/head'
import Layout from "@/components/Layout/Layout";
import {useAccount, useSigner} from "wagmi";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack, Textarea, useColorModeValue, useToast
} from "@chakra-ui/react";
import {ethers} from "ethers";
import {useState} from "react";
import { useMutation } from '@apollo/client';
import {contractAddress, abi} from "@/constants";
import {REQUEST} from "@/services/graphql";

export default function submitProject() {
    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const toast = useToast();

    const [name, setName] = useState(null);
    const [token, setToken] = useState(null);
    const [codeSource, setCodeSource] = useState(null);
    const [socialMedia, setSocialMedia] = useState(null);
    const [email, setEmail] = useState(null);
    const [description, setDescription] = useState(null);
    const [submitProject, submitProjectResult] = useMutation(
        REQUEST.MUTATION.PROJECT.SUBMIT_PROJECT,
    );

    const submitNewProject = async() => {
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer)
            let transaction = await contract.submitProject(name);
            const receipt = await transaction.wait();
            console.log(receipt);
            const daoId = ethers.BigNumber.from(receipt.events[0].args.projectId).toNumber();

            await submitProject({
                variables: {
                    daoId: daoId.toString(),
                    name: name,
                    token: token,
                    codeSource: codeSource,
                    socialMedia: socialMedia,
                    email: email,
                    description: description
                },
            });

            if (submitProjectResult.error) {
                toast({
                    title: 'Error',
                    description: "An error occured.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                console.log(submitProjectResult.error);
            }
            else
            {
                toast({
                    title: 'Congratulations',
                    description: "The project has been submitted !",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        }
        catch(e) {
            toast({
                title: 'Error',
                description: "An error occured.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            console.log(e)
        }
    }

    return(
        <Layout>
            <Flex
                w={'full'}
                minH={'100vh'}
                align={'center'}
                justify={'center'}>
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={6}
                    my={12}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        Submit Project
                    </Heading>
                    <FormControl id="name" isRequired>
                        <FormLabel>Project Name</FormLabel>
                        <Input
                            placeholder="Name"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="token" isRequired>
                        <FormLabel>Token</FormLabel>
                        <Input
                            placeholder="Token"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="email">
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="socialMedia">
                        <FormLabel>Social Media</FormLabel>
                        <Input
                            placeholder="@dao..."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setSocialMedia(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="codeSource">
                        <FormLabel>Code Source</FormLabel>
                        <Input
                            placeholder="Github..."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setCodeSource(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="description">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Description"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'blue.500',
                            }}
                            onClick={() => submitNewProject()}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </Layout>
    )
}