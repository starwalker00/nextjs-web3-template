import { useAppContext } from '../state';
import { Box, Center, Flex, Image, Text, WrapItem, VStack, Spacer, Button, Link } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import useSWR, { useSWRConfig } from 'swr'
import { Spinner } from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import JSONPretty from 'react-json-pretty';

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
        let maxIter = min(MAX_POSTS, numberOfPosts);
        // for (let pubIter = 1; pubIter <= 1; pubIter++) {
        for (let pubIter = 1; pubIter <= maxIter; pubIter++) {
            console.log(`pubIter  : ${JSON.stringify(pubIter)}`)
            pub = await lensHub.getPub(profileId, pubIter)
            console.log(`pub  : ${JSON.stringify(pub)}`)
        }
        return pub;
    }
    // const { mutate } = useSWRConfig()
    const { data, error, isValidating, mutate } = useSWR(shouldFetch ? profileId : null, fetcherPub);
    const handleModalOpenClicked = async () => {
        onOpen();
        // mutate(profileId);
    }
    return (
        <>
            {/* {dataPub && console.log(`dataPub  : ${JSON.stringify(dataPub)}`)} */}
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
            <Modal size='xl' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        getPub() contract response
                    </ModalHeader>
                    <ModalCloseButton colorScheme='teal' variant='solid' />
                    <ModalBody>
                        {error &&
                            <Text overflow='auto'>error{console.log(error)}</Text>
                        }
                        {/* {isValidating &&
                            <Center>
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='e3cfff'
                                    size='xl'
                                />
                            </Center>
                        } */}
                        {data &&
                            <Text overflow='auto'>
                                {console.log(`data  : ${JSON.stringify(data)}`)}
                                <JSONPretty id="json-pretty" data={JSON.stringify(data)}></JSONPretty>
                            </Text>
                        }
                    </ModalBody>
                    <ModalFooter>
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
