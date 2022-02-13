import { Box, Center, Flex, Image, Text, WrapItem, VStack, Spacer, Button, Link } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
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

function ProfileItemPublicationJSONModal({ posts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button
                colorScheme='teal'
                variant='solid'
                mr={3}
                onClick={onOpen}>
                JSON
            </Button>
            <Modal size='full' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        getPub() contract responses - {posts ? posts.length : 0} publication(s)
                    </ModalHeader>
                    <ModalCloseButton colorScheme='teal' variant='solid' />
                    <ModalBody>
                        <Text as='div' overflow='auto'>
                            <JSONPretty id="json-pretty" data={JSON.stringify(posts)}></JSONPretty>
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='teal' variant='solid' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileItemPublicationJSONModal
