import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer } from '@chakra-ui/react'
import ProfileItemJSONModal from '../components/ProfileItemJSONModal'
import ProfileItemPublicationListModal from '../components/ProfileItemPublicationListModal'

function ProfileItem({ profile }) {
    let profileId = profile[0];
    // let numberOfPosts = profile[1].toNumber();
    let handle = profile[4];
    let imageURI = profile[5];

    // console.log(profile)
    return (
        <WrapItem
            alignItems="center"
            justifyContent="center"
            minW='xs'
            flexGrow="1"
            boxShadow='0px 0px 6px 0px #DA70D6'
            background='teal'
            color='white'
            _hover={{
                background: "floralwhite",
                color: "teal.500",
                cursor: "pointer",
            }
            }
        >
            <Image p="4px 12px 4px 2px" m="2px 20px 2px 12px"
                src={imageURI}
                alt={imageURI}
                borderRadius='full'
                boxSize='150px'
                objectFit='cover'
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = "lens-protocol.png";
                }}
            />
            <VStack>
                <Text p="0" letterSpacing="1px" fontWeight="normal" fontSize="md">
                    {profileId}
                </Text>
                <Text p="0" letterSpacing="1px" fontWeight="bold" fontSize="md">
                    {handle}
                </Text>
                <ProfileItemPublicationListModal profile={profile} />
                <ProfileItemJSONModal profile={profile} />
            </VStack>
        </WrapItem >
    )
}

export default ProfileItem
