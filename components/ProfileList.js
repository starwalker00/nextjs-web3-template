import { useAppContext } from '../state';
import useSWRInfinite from "swr/infinite";
import { Box, Button, ButtonGroup, Container, Wrap, Center, Input, Flex, Text } from '@chakra-ui/react'
import ProfileItem from '../components/ProfileItem'
import { Spinner } from '@chakra-ui/react'
import { ethers } from 'ethers';
import { useState } from 'react';

const PAGE_SIZE = 9
const hasStrings = (input) => {
    let regExp = /[a-zA-Z]/g
    return regExp.test(input)
}

const getKey = (pageIndex, previousPageData, searchValue, pageSize) => {
    // console.log(`pageIndex  : ${JSON.stringify(pageIndex)}`)
    // console.log(`previousPageData  : ${JSON.stringify(previousPageData)}`)
    console.log(`searchValue  : ${JSON.stringify(searchValue)}`)

    let cursor // is the first profileId to be newly fetched
    if (searchValue) { // user searched for a profileId
        cursor = searchValue
    }
    else if (previousPageData) { // user clicked on `load more`
        let lastDisplayedProfile = previousPageData.slice(-1)
        let lastDisplayedProfileId = lastDisplayedProfile[0]
        cursor = lastDisplayedProfileId[0] - 1 // first profileId of the next page
    } else { // initial loading or reset
        cursor = null
    }
    console.log(`cursor  : ${JSON.stringify(cursor)}`)
    return [cursor, PAGE_SIZE]
    // return searchValue
}

export default function ProfileList({ fallbackData, profileTotalSupply }) {
    // console.log(`fallbackData  : ${JSON.stringify(fallbackData)}`)
    // console.log(`profileTotalSupply  : ${JSON.stringify(profileTotalSupply)}`)

    const [searchValue, setSearchValue] = useState(null)
    const [val, setVal] = useState(null)
    const [updatedProfileTotalSupply, setProfileTotalSupply] = useState(profileTotalSupply)
    const { lensHub } = useAppContext()

    const fetcher = async (cursor, pageSize) => {
        console.log("fetcher profile");
        console.log(`cursor  : ${JSON.stringify(cursor)}`)
        let profileTotalSupply = await lensHub.totalSupply();
        setProfileTotalSupply(profileTotalSupply.toNumber())
        if (!cursor) { // set cursor value to max profileId if not provided
            cursor = profileTotalSupply.toNumber()
        }
        if (ethers.BigNumber.isBigNumber(cursor)) {
            cursor = cursor.toNumber()
        }
        // profileId (number) or handle (string)
        if (hasStrings(cursor)) {
            console.log(`hasStrings`)
            // has strings, get profileId by handle
            cursor = await lensHub.getProfileIdByHandle(cursor);
            cursor = cursor.toNumber()
            // console.log(`cursor  : ${JSON.stringify(cursor)}`)
        }
        // main profile fetching loop
        let profile
        let profiles = []
        for (let profileId = cursor; (profileId > cursor - pageSize) && profileId > 0; profileId--) {
            // console.log(`profileId  : ${JSON.stringify(profileId)}`)
            profile = await lensHub.getProfile(profileId);
            profile = [profileId, ...profile]
            if (ethers.BigNumber.isBigNumber(profile[1])) {
                // data coming from fallback is already a JS number because it was converted 
                // to be able to be serialized when passing props from index.js->getStaticProps
                profile[1] = profile[1].toNumber();
            }
            profiles.push(profile);
            // console.log(`profiles  : ${JSON.stringify(profiles)}`)
        }
        // console.log(`profiles  : ${JSON.stringify(profiles)}`)
        return profiles
    }

    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        (...args) => getKey(...args, searchValue, PAGE_SIZE),
        fetcher,
        {
            fallbackData: fallbackData,
            revalidateOnMount: true
        }
    );
    if (error) return (
        <Center>
            Failed to load
            {console.log(error)}
        </Center>
    )
    if (!data) return (
        <Center>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='e3cfff'
                size='xl'
            />
        </Center>
    )
    const results = data ? [].concat(...data) : [];
    return (
        <>
            {/* <Box onLoad={() => setSize(size + 1)} d='none'></Box> */}
            <Flex justifyContent='space-evenly' alignItems='center' boxShadow='0px 0px 1px 0px #DA70D6' p='2'>
                <Box>
                    <Text>
                        Total number of profiles : {updatedProfileTotalSupply}
                    </Text>
                </Box>
            </Flex>
            <Flex wrap='wrap' justifyContent='space-evenly' alignItems='center' boxShadow='0px 0px 5px 0px #DA70D6'>
                <Input
                    width='50%'
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder="profileId or handle"
                />
                <Button m='3'
                    onClick={() => {
                        setSearchValue(val)
                        setSize(1)
                    }}
                    colorScheme='teal' variant='solid'
                    isLoading={isValidating}
                    loadingText='Loading' spinnerPlacement='start'
                >
                    SEARCH
                </Button>
                <Button m='3'
                    onClick={() => {
                        setSearchValue(null)
                        setSize(1)
                    }}
                    colorScheme='teal' variant='solid'
                >
                    Go to last profile
                </Button>
            </Flex>
            <Wrap spacing='5px' align='center' justify='center'>
                {results &&
                    results.map(
                        (profile, index) => (
                            <ProfileItem profile={profile} key={index} >
                                {/* {console.log(`profile  : ${JSON.stringify(profile)}`)} */}
                            </ProfileItem>
                        )
                    )
                }
            </Wrap>
            <Center m='10'>
                <Button m='5'
                    onClick={() => {
                        setSearchValue(null)
                        setSize(1)
                    }}
                    colorScheme='teal' variant='solid'
                >
                    Reset
                </Button>
                <Button m='5'
                    onClick={() => {
                        setSearchValue(null)
                        setSize(size + 1)
                    }}
                    colorScheme='teal' variant='solid'
                    isLoading={isValidating}
                    loadingText='Loading' spinnerPlacement='start'
                >
                    Load more
                </Button>
            </Center>
        </>
    )

}
