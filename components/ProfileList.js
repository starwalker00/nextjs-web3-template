import { useAppContext } from '../state';
import useSWRInfinite from "swr/infinite";
import { Box, Button, ButtonGroup, Container, Wrap, Center } from '@chakra-ui/react'
import ProfileItem from '../components/ProfileItem'

export default function ProfileList() {
    const { lensHub } = useAppContext();
    const profilePerCall = 9;
    const fetcher = async (cursor) => {
        console.log("fetcher");
        // console.log(`cursor  : ${JSON.stringify(cursor)}`)
        let profileCount = await lensHub.totalSupply();
        if (cursor == 999999) { cursor = profileCount.toNumber() };
        console.log(`cursor  : ${JSON.stringify(cursor)}`)
        // console.log(`profileCount  : ${JSON.stringify(profileCount)}`)
        let profile;
        let profiles = [];
        for (let profileId = cursor; profileId > cursor - profilePerCall; profileId--) {
            if (profileId > 0) {
                console.log(`profileId  : ${JSON.stringify(profileId)}`)
                profile = await lensHub.getProfile(profileId);
                profile = [profileId, ...profile]
                profiles.push(profile);
                // console.log(`profiles  : ${JSON.stringify(profiles)}`)
            } else {
                break;
            }
        }
        return profiles
    }
    const getKey = (pageIndex, previousPageData) => {
        if (pageIndex === 0) return 999999 // is then transformed into totalNumber of profiles
        if (previousPageData) { // send last profileId as cursor
            let tmp = previousPageData.slice(-1);
            let tmp2 = tmp[0];
            return tmp2[0] - 1
        }
        return previousPageData
    }
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        getKey,
        fetcher
    );
    if (error) return <div>failed to load{console.log(error)}</div>
    if (!data) return <div>loading...</div>
    const results = data ? [].concat(...data) : [];
    return (
        <>
            <Wrap spacing='5px' align='center' justify='center'>
                {results &&
                    results.map(
                        (profile, index) => (
                            <ProfileItem profile={profile} key={index} ></ProfileItem>
                        )
                    )
                }
            </Wrap>
            <Center m='10'>
                <Button onClick={() => setSize(1)}>
                    reset
                </Button>
                <Button onClick={() => setSize(size + 1)}>
                    load more
                </Button>
            </Center>
        </>
    )

}
