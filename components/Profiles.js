import { useAppContext } from '../state';
import useSWRInfinite from "swr/infinite";

export default function Profiles() {
    const { lensHub } = useAppContext();
    const profilePerCall = 10;
    const fetcher = async (cursor) => {
        console.log("fetcher");
        console.log(`cursor  : ${JSON.stringify(cursor)}`)
        let profileCount = await lensHub.totalSupply();
        // console.log(`profileCount  : ${JSON.stringify(profileCount)}`)
        let profile;
        let profileId;
        let profiles = [];
        for (let profileIter = cursor; profileIter < cursor + profilePerCall; profileIter++) {
            profileId = profileCount - profileIter;
            profile = await lensHub.getProfile(profileId);
            profile = [profileId, ...profile]
            profiles[profileIter] = profile;
        }
        return profiles
    }
    const getKey = (pageIndex, previousPageData) => {
        if (pageIndex === 0) return 1
        if (previousPageData) { // send last profileId as cursor
            let tmp = previousPageData.slice(-1);
            let tmp2 = tmp[0];
            return tmp2[0] + 1
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
        <div>
            <button onClick={() => setSize(1)}>
                reset
            </button>
            <button onClick={() => setSize(size + 1)}>
                load more
            </button>
            <ul>
                {(results.map((item, index) =>
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    )

}
