import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Textarea,
    useColorModeValue, useToast
} from "@chakra-ui/react";
import {useSigner} from "wagmi";
import {useState} from "react";
import {ethers} from "ethers";
import {abiGovernance, contractGovernanceAddress} from "@/constants";


export default function ProposalForm() {
    const { data: signer } = useSigner();
    const toast = useToast();

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);

    const submitNewProposal = async() => {
        try {
            const contract = new ethers.Contract(contractGovernanceAddress, abiGovernance, signer)
            await contract.submitProposal(name, description);

            toast({
                title: 'Congratulations',
                description: "The proposal has been submitted !",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
        catch(e) {
            toast({
                title: 'Error',
                description: "An error occured.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return(
        <>
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
                        Submit Proposal
                    </Heading>
                    <FormControl id="name" isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Name"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="description" isRequired>
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
                            onClick={() => submitNewProposal()}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </>
    )
}