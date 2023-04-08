import Layout from "@/components/Layout/Layout";
import {
    Box,
    Container,
    Divider,
    Heading,
    Image,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";

export default function HowItWorks()
{
    return(
        <Layout>
            <Container maxW={'7xl'} p="12">
                <Heading as="h1">*How it works *</Heading>
                <VStack paddingTop="40px" spacing="2" alignItems="flex-start">
                    <Text as="p" fontSize="lg">
                        Welcome here you are allowed to choose your path within our community. You can be a Finder or
                        a Brainer or even both! Each path grants you power, but also comes with significant
                        responsibilities. Are you ready to take them on?
                    </Text>
                    <Text as="p" fontSize="lg">
                        By joining our DAO, you will help build the Web 3 world of tomorrow by becoming a member of the
                        largest DYOR (Do Your Own Research) sharing community in the world. Who knows, maybe you will
                        become a sage among us... Join us now to find out how it works!
                    </Text>
                </VStack>
                <Divider marginTop="5" />
                <Box
                    marginTop={{ base: '1', sm: '5' }}
                    display="flex"
                    flexDirection={{ base: 'column', sm: 'row' }}
                    justifyContent="space-between">
                    <Box
                        display="flex"
                        flex="1"
                        marginRight="3"
                        position="relative"
                        alignItems="center">
                        <Box
                            width={{ base: '100%', sm: '85%' }}
                            zIndex="2"
                            marginLeft={{ base: '0', sm: '5%' }}
                            marginTop="5%">
                            <Image
                                transform="scale(1.0)"
                                src={
                                    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80'
                                }
                                alt="some text"
                                objectFit="contain"
                                width="100%"
                                transition="0.3s ease-in-out"
                                _hover={{
                                    transform: 'scale(1.05)',
                                }}
                            />
                        </Box>
                        <Box zIndex="1" width="100%" position="absolute" height="100%">
                            <Box
                                bgGradient={useColorModeValue(
                                    'radial(orange.600 1px, transparent 1px)',
                                    'radial(orange.300 1px, transparent 1px)'
                                )}
                                backgroundSize="20px 20px"
                                opacity="0.4"
                                height="100%"
                            />
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flex="1"
                        flexDirection="column"
                        justifyContent="center"
                        marginTop={{ base: '3', sm: '0' }}>
                        <Heading marginTop="1">Finder:</Heading>
                        <Text
                            as="p"
                            marginTop="2"
                            color={useColorModeValue('gray.700', 'gray.200')}
                            fontSize="lg">
                            Are you ready to become a Finder in our DAO? As a Finder, you will be the gateway to
                            our community, bringing in valuable materials for us to work with. Your role is crucial,
                            so dont take it lightly! Only propose what you are genuinely interested in discovering
                            and be judged on the quality of your research.
                        </Text>
                        <Text
                            as="p"
                            marginTop="2"
                            color={useColorModeValue('gray.700', 'gray.200')}
                            fontSize="lg">
                            But dont worry if you are new to this! We will teach you how to gather information
                            effectively and how to sort through it to find the most relevant pieces. After all,
                            its better to have lots of information than none at all, right?
                        </Text>
                        <Text
                            as="p"
                            marginTop="2"
                            color={useColorModeValue('gray.700', 'gray.200')}
                            fontSize="lg">
                            Stay tuned for more details on the benefits and responsibilities of being a Finder in our DAO
                            Join our community of Finders today and unlock the power to shape the future of our DAO!
                        </Text>
                    </Box>
                </Box>
                <Divider marginTop="5" />
                <Box
                    display="flex"
                    flex="1"
                    flexDirection="column"
                    justifyContent="center"
                    marginTop={{ base: '3', sm: '0' }}>
                    <Heading marginTop="1">Brainer:</Heading>
                    <Text
                        as="p"
                        marginTop="2"
                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        Are you ready to take the leap and become a Brainer in our DAO? Think carefully, as it comes
                        with exclusive benefits but also important responsibilities. As the heart of our DAO, Brainers
                        evaluate the projects of Finders and must understand the significance of this responsibility.
                    </Text>
                    <Text
                        as="p"
                        marginTop="2"
                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        Contribute to the development of our DAO by proposing tools to improve research quality.
                        Be the mentors of our Finders, and perhaps one day, you will become a sage. But beware,
                        nothing comes without a tradeoff! You must be ready to take on the responsibilities that
                        come with your role as a Brainer.
                    </Text>
                    <Text
                        as="p"
                        marginTop="2"
                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        Stay tuned for more details on the benefits and responsibilities of being a Brainer in our DAO.
                        Join us now and become a key player in shaping the future of our community!
                    </Text>
                    <Box
                        display="flex"
                        flex="1"
                        marginRight="3"
                        position="relative"
                        alignItems="center">
                        <Box
                            width={{ base: '100%', sm: '85%' }}
                            zIndex="2"
                            marginLeft={{ base: '0', sm: '5%' }}
                            marginTop="5%">
                            <Image
                                transform="scale(1.0)"
                                src={
                                    'https://images.pexels.com/photos/8369837/pexels-photo-8369837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                }
                                alt="some text"
                                objectFit="contain"
                                width="100%"
                                transition="0.3s ease-in-out"
                                _hover={{
                                    transform: 'scale(1.05)',
                                }}
                            />
                        </Box>
                        <Box zIndex="1" width="100%" position="absolute" height="100%">
                            <Box
                                bgGradient={useColorModeValue(
                                    'radial(orange.600 1px, transparent 1px)',
                                    'radial(orange.300 1px, transparent 1px)'
                                )}
                                backgroundSize="20px 20px"
                                opacity="0.4"
                                height="100%"
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Layout>
    )
}