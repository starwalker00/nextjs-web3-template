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
    const LensHubMumbaiContractURL = "https://mumbai.polygonscan.com/address/0xF6BF84E5df229029C9D36dC7ABaCDBE9c0bd7b4F";
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal size='xl' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        getProfile() contract response
                    </ModalHeader>
                    <ModalCloseButton colorScheme='teal' variant='solid' />
                    <ModalBody>
                        <Text overflow='auto'>
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
