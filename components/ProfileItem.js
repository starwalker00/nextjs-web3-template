import { Box, Center, Flex, Image, Text, WrapItem } from '@chakra-ui/react'

function ProfileItem({ profile }) {
    let profileId = profile[0];
    let handle = profile[4];
    let imageURI = profile[5];
    return (
        <WrapItem
            alignItems="center"
            flexGrow="2"
            boxShadow='lightskyblue 0px 0px 9px 0px'
            background='teal'
            color='white'
            _hover={{
                background: "white",
                color: "teal.500",
                cursor: "pointer",
            }
            }
        >
            <Image p="2"
                src={imageURI}
                alt={imageURI}
                borderRadius='full'
                boxSize='150px'
                objectFit='cover' />
            <Text p="2" letterSpacing="1px" fontWeight="bold" fontSize="md">
                {profileId} -
            </Text>
            <Text p="0" letterSpacing="1px" fontWeight="bold" fontSize="md">
                {handle}
            </Text>
        </WrapItem >
    )
}

export default ProfileItem
