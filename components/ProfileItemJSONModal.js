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

function ProfileItemJSONModal({ profile }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    let profileId = profile[0];
    let handle = profile[4];
    return (
        <>
            <Button
                size='xs'
                colorScheme='teal'
                variant='solid'
                onClick={onOpen}>
                JSON
            </Button>
            <Modal size='xl' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        getProfile() contract response - {profileId}{':'}{handle}
                    </ModalHeader>
                    <ModalCloseButton colorScheme='teal' variant='solid' />
                    <ModalBody>
                        <Text as='div' overflow='auto'>
                            <JSONPretty id="json-pretty" data={JSON.stringify(profile)}></JSONPretty>
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

export default ProfileItemJSONModal
