import {
    Box,
    Container,
    Flex,
    Heading,
    Icon,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    FcAbout,
    FcAssistant,
    FcCollaboration,
    FcDonate,
    FcManager,
} from 'react-icons/fc';

const roadMapContents = [
    {
        'name':"Phase 1",
        'description':"Presentation MVP to Alyra jury.",
        'icon':FcAbout
    },
    {
        'name':"Phase 2",
        'description':"Launch Testnet.",
        'icon':FcAssistant
    },
    {
        'name':"Phase 3",
        'description':"Vesting of Brainer and Finder NFTs.",
        'icon':FcCollaboration
    },
    {
        'name':"Phase 4",
        'description':"Release SAGE token ERC20 on Polygon.",
        'icon':FcDonate
    },
    {
        'name':"Phase 5",
        'description':"Launch MainNet",
        'icon':FcManager
    },
]

const ListRoadMap = () => {

    const gray = useColorModeValue('gray.100', 'gray.700');

    return roadMapContents.map(content => {
        return(
            <Box
                key={content.name}
                maxW={{ base: 'full', md: '275px' }}
                w={'full'}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={5}>
                <Stack align={'start'} spacing={2}>
                    <Flex
                        w={16}
                        h={16}
                        align={'center'}
                        justify={'center'}
                        color={'white'}
                        rounded={'full'}
                        bg={gray}>
                        <Icon as={content.icon} w={10} h={10} />
                    </Flex>
                    <Box mt={2}>
                        <Heading size="md">{content.name}</Heading>
                        <Text mt={1} fontSize={'sm'}>
                            {content.description}
                        </Text>
                    </Box>
                </Stack>
            </Box>
        )
    })
}

export default function RoadMap() {
    return (
        <Box p={4}>
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
                    Our roadmap
                </Heading>
                <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
                    A timeline of development stages and key milestones planned for the project.
                </Text>
            </Stack>

            <Container maxW={'5xl'} mt={12}>
                <Flex flexWrap="wrap" gridGap={6} justify="center">
                    <ListRoadMap/>
                </Flex>
            </Container>
        </Box>
    )
}