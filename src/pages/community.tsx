import { type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { Spinner } from '~/components/Spinner';
import { api } from '~/utils/api';
import { getImageUrl } from '~/utils/imageUtils';

const CollectionPage: NextPage = () => {
    const { data, isLoading } = api.icons.getCommunityIcons.useQuery();

    return (
        <>
            <Head>
            <title>Community</title>
            <meta name="description" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container max-w-screen-lg mx-auto mt-6 text-white gap-4 px-4 justify-center items-top">
                <h2 className='text-2xl mb-3'>Community icons</h2>
                <ul className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 mb-12'>
                    { isLoading && <Spinner /> }
                    { data && data.map(icon => (
                            <li >
                                <Image 
                                    src={getImageUrl(icon.id)} 
                                    className='py-2' 
                                    alt={'prompt'} 
                                    width={250} 
                                    height={250} />
                            </li>

                    ))}
                </ul>
            </main>
        </>
    );
};

export default CollectionPage;

