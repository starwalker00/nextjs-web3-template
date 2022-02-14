import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer } from '@chakra-ui/react'
import ProfileItemJSONModal from '../components/ProfileItemJSONModal'
import ProfileItemPublicationListModal from '../components/ProfileItemPublicationListModal'
import { sanitizeUrl } from '@braintree/sanitize-url'
import axios from 'axios'
import { useState, useEffect } from 'react'

const defaultImageURI = 'lens-protocol.png';
async function isReachable(imageURI) {
    let isReachable = false;
    try {
        console.log(`axios.get : ${JSON.stringify(imageURI)}`)
        await axios.get(imageURI, { withCredentials: false });
        isReachable = true;
        // in the future, test if it really is an image
    } catch (error) {
        if (error.message == 'Network Error') // manage CORS policy
        {
            isReachable = true;
        }
        console.log(`imageURI unreachable : ${imageURI}`)
        // console.log(`error : ${JSON.stringify(error)}`)
    }
    return isReachable
}

async function mySanitizer(suspectURL) {
    let cleanURL = sanitizeUrl(suspectURL);
    if (!cleanURL.toLowerCase().startsWith('https://'))
        return defaultImageURI
    if (await isReachable(cleanURL)) {
        return cleanURL
    } else {
        return defaultImageURI
    }
}

function ProfileItem({ profile }) {
    const [imageURI, setImageURI] = useState(profile[5]);
    useEffect(async () => {
        let cleanImageURI = await mySanitizer(imageURI);
        setImageURI(cleanImageURI)
    }, [])

    let profileId = profile[0];
    // let numberOfPosts = profile[1].toNumber();
    let handle = profile[4];

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
            transition='0.3s'
            _hover={{
                background: "floralwhite",
                color: "teal.500",
                cursor: "pointer",
            }
            }
        >
            <Image p="4px 12px 4px 2px" m="2px 20px 2px 12px" color='blue'
                src={imageURI}
                alt={imageURI}
                borderRadius='full'
                boxSize='150px'
                objectFit='cover'
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = 'lens-protocol.png';
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
