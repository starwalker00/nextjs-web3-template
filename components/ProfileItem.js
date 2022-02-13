import { Box, Center, Flex, Image, Text, WrapItem, VStack, Spacer } from '@chakra-ui/react'

function ProfileItem({ profile }) {
    let profileId = profile[0];
    let numberOfPosts = profile[1].toNumber();
    let handle = profile[4];
    let imageURI = profile[5];

    console.log(profile)
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
            <VStack >
                <Text p="0" letterSpacing="1px" fontWeight="normal" fontSize="md">
                    {profileId}
                </Text>
                <Text p="2" letterSpacing="1px" fontWeight="bold" fontSize="md">
                    {handle}
                </Text>
                {
                    numberOfPosts > 0
                        ? <Text p="0" letterSpacing="1px" fontSize="xs">{numberOfPosts} posts</Text>
                        : <Text p="0" letterSpacing="1px" fontSize="xs">{numberOfPosts} post</Text>
                }
            </VStack>
        </WrapItem >
    )
}

export default ProfileItem
