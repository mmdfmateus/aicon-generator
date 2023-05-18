import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import Head from "next/head";
import Image from 'next/image';
import { Spinner } from '~/components/Spinner';
import { api } from '~/utils/api';
import { getImageUrl } from '~/utils/imageUtils';

const CollectionPage: NextPage = () => {
    const { data: sessionData } = useSession();

    const { data, isLoading } = api.icons.get.useQuery();

    return (
        <>
            <Head>
            <title>My collection</title>
            <meta name="description" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container max-w-screen-lg mx-auto mt-6 text-white gap-4 px-4 justify-center items-top">
                <h2 className='text-2xl mb-3'>Your icons</h2>
                <ul className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 mb-12'>
                    { !sessionData && <h2>Log in to see your icons</h2> }
                    { isLoading && <Spinner /> }
                    { !isLoading && data?.length === 0 && 
                        <h2>You didn't generate any icons yet</h2>
                    }
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

