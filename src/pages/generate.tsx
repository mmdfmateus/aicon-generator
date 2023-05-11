import { type NextPage } from "next";
import Head from "next/head";

import { Input } from '~/components/Input';
import { FormGroup } from '~/components/FormGroup';
import { type ChangeEvent, useState, type FormEvent } from 'react';
import { api } from '~/utils/api';
import { Button } from '~/components/Button';
import Image from 'next/image';

const GeneratePage: NextPage = () => {

    const [form, setForm] = useState({
        prompt: '',
    });
    const [imageUrl, setImageUrl] = useState('');

    const updateForm = (key: string) => {
        return function (e: ChangeEvent<HTMLInputElement>){
            setForm((prev) => ({
                ...prev,
                [key]: e.target.value
            }));
        }
    };

    const generateIcon = api.generate.generateIcon.useMutation({
        onSuccess(data) {
            console.log('mutation finished', data);

            setImageUrl(data.imageUrl);
            setForm({ prompt: '' });
        }
    });

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        await generateIcon.mutateAsync({
            prompt: form.prompt
        });

        
    }

    return (
        <>
            <Head>
            <title>Generate</title>
            <meta name="description" content="Generate icons with AI" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col text-white items-center justify-center">
                <form className='flex flex-col gap-4' onSubmit={handleFormSubmit} >
                    <FormGroup>
                        <label>Prompt</label>
                        <Input value={form.prompt} type="text" onChange={updateForm('prompt')} />
                    </FormGroup>
                    <Button>Submit</Button>
                </form>
                {imageUrl ?? 
                    <Image 
                    src={imageUrl} 
                    className='py-2' 
                    alt={'prompt'} 
                    width={250} 
                    height={250} />
                }
            </main>
        </>
    );
};

export default GeneratePage;

