import { useAppContext } from '../state';
import { Box, Center, Flex, Image, Text, Wrap, WrapItem, VStack, Spacer, Button, Link } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import useSWR from 'swr'
import ProfileItemPublicationJSONModal from '../components/ProfileItemPublicationJSONModal'
import { Grid, GridItem } from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

function min(a, b) {
    return a > b ? b : a;
}

function ProfileItemPublicationListModal({ profile }) {
    const MAX_POSTS = 10;
    const { lensHub } = useAppContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    let profileId = profile[0];
    let handle = profile[4];

    let numberOfPosts = profile[1].toNumber();
    let shouldFetch;
    if (numberOfPosts < 1) {
        shouldFetch = false;
    } else {
        shouldFetch = true;
    }
    // // client side data fetching
    const fetcherPub = async (profileId) => {
        console.log(`fetcher publication - profile handle  : ${JSON.stringify(handle)} - ${JSON.stringify(numberOfPosts)} post(s)`)
        let pub;
        let pubs = [];
        let maxIter = min(MAX_POSTS, numberOfPosts);
        // for (let pubIter = 1; pubIter <= 1; pubIter++) {
        for (let pubIter = 1; pubIter <= maxIter; pubIter++) {
            console.log(`pubIter  : ${JSON.stringify(pubIter)}`)
            pub = await lensHub.getPub(profileId, pubIter)
            pubs.push(pub);
            console.log(`pub  : ${JSON.stringify(pub)}`)
        }
        return pubs;
    }
    const { data, error, isValidating, mutate } = useSWR(shouldFetch ? profileId : null, fetcherPub);
    const handleModalOpenClicked = async () => {
        onOpen();
        // mutate(profileId);
    }
    return (
        <>
            <Button
                size='xs'
                colorScheme='teal'
                variant='solid'
                onClick={() => handleModalOpenClicked()}
            >
                {
                    numberOfPosts > 0
                        ? <Text p="1" letterSpacing="1px" fontSize="xs">{numberOfPosts} posts</Text>
                        : <Text p="1" letterSpacing="1px" fontSize="xs">{numberOfPosts} post</Text>
                }
            </Button>
            <Modal size='3xl' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg='white'>
                    <ModalHeader>
                        getProfile() contract response - {profileId}{':'}{handle} - {data ? data.length : 0} publication(s)
                    </ModalHeader>
                    <ModalCloseButton colorScheme='teal' variant='solid' />
                    <ModalBody>
                        {error &&
                            <Text overflow='auto'>error{console.log(error)}</Text>
                        }
                        <Grid direction='column'>
                            {data &&
                                data.map(
                                    (post, index) => (
                                        <GridItem key={index}>
                                            {/* <VStack boxShadow='0px 0px 6px 0px lavender'> */}
                                            <VStack border='1px solid #cccccc'>
                                                <Box alignSelf='flex-start' ml='10px'>
                                                    <Text letterSpacing="1px" fontWeight="bold" fontSize="md" boxShadow='0px 4px 6px -6px #DA70D6'>
                                                        pubId : {index}
                                                    </Text>
                                                </Box>
                                                <Box justifySelf='center' pb='10px'>
                                                    <Image
                                                        src={post[2]}
                                                        borderRadius='2%'
                                                        maxH='300px'
                                                        onError={({ currentTarget }) => {
                                                            currentTarget.onerror = null; // prevents looping
                                                            currentTarget.src = "lens-protocol.png";
                                                        }}
                                                    />
                                                </Box >
                                            </VStack>
                                        </GridItem>
                                    )
                                )
                            }
                        </Grid >

                    </ModalBody>
                    <ModalFooter>
                        <ProfileItemPublicationJSONModal posts={data} />
                        <Button
                            isLoading={isValidating}
                            isActive={false}
                            isDisabled={true}
                            loadingText='Validating'
                            spinnerPlacement='end'
                            colorScheme='teal'
                            variant='outline'
                            mr={3}
                        >
                            Validated
                        </Button>
                        <Button colorScheme='teal' variant='solid' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileItemPublicationListModal
