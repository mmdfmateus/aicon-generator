import { type NextPage } from "next";
import Head from "next/head";

import { Input } from '~/components/Input';
import { FormGroup } from '~/components/FormGroup';
import { type ChangeEvent, useState, type FormEvent } from 'react';
import { api } from '~/utils/api';
import { Button } from '~/components/Button';
import Image from 'next/image';
import toast from 'react-hot-toast';

const colors = ['blue', 'orange', 'black', 'red', 'yellow', 'green', 'white', 'purple'];

const GeneratePage: NextPage = () => {

    const [form, setForm] = useState({
        prompt: '',
        color: '',
        amount: '1',
    });
    const [imagesUrl, setImagesUrl] = useState<string[]>([]);

    const updateForm = (key: string) => {
        return function (e: ChangeEvent<HTMLInputElement>){
            setForm((prev) => ({
                ...prev,
                [key]: e.target.value
            }));
        }
    };

    const ctx = api.useContext();

    const generateIcon = api.generate.generateIcon.useMutation({
        onSuccess(data) {
            setImagesUrl(prev => [...prev, ...data]);
            void ctx.user.getCredits.invalidate();
        },
        onError(error) {
            console.log(error);
            toast.error(error.message);

            setImagesUrl([]);
        },
    });

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await generateIcon.mutateAsync({
                prompt: form.prompt,
                color: form.color,
                amount: parseInt(form.amount),
            });
        } catch (error) {
        }

        
    }

    return (
        <>
            <Head>
            <title>Generate Icons</title>
            <meta name="description" content="Generate icons with AI" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto max-w-screen-lg mt-20 flex flex-col text-white gap-4 px-4">
                <h1 className='text-5xl'>Let's create some icons!</h1>
                <p className='text-2xl text-slate-300'>Describe as much as possible how you want it to look like</p>
                <form className='flex flex-col gap-4 mt-8' onSubmit={handleFormSubmit} >
                    <h2>1. Describe what the icon should look like</h2>
                    <FormGroup className='mb-5'>
                        <Input 
                            required
                            value={form.prompt} 
                            type="text" 
                            onChange={updateForm('prompt')} 
                            />
                    </FormGroup>

                    <h2>2. Pick your icon color</h2>
                    <FormGroup className='grid grid-cols-4 mb-5'>
                        {colors.map((color) => (
                            <label key={color} className='flex items-center gap-2 text-md cursor-pointer'>
                                <Input 
                                    required
                                    value={color} 
                                    type="radio" 
                                    name='color'
                                    checked={color === form.color} 
                                    onChange={updateForm('color')} />
                                {color}
                            </label>
                        ))}
                    </FormGroup>

                    <div className='flex justify-between p-4'>
                        <div className='flex flex-col justify-center gap-2 items-center w-1/2'>
                            <h2>3. How many do you want?</h2>
                            <FormGroup className=''>
                                <label className='flex items-center gap-2 text-md cursor-pointer'>
                                    <Input 
                                        required
                                        type='number'
                                        name='amount'
                                        min='1'
                                        max='4'
                                        step='1'
                                        value={form.amount}
                                        onChange={updateForm('amount')}
                                        className='min-w-full' />
                                </label>
                            </FormGroup>
                        </div>

                        <Button
                            isLoading={generateIcon.isLoading}
                            className='flex-grow text-xl font-bold'
                            >
                            Submit
                        </Button>
                    </div>
                </form>

                {imagesUrl.length > 0 &&
                    <>
                        <h2>Your icons</h2>
                        <section className='grid grid-cols-4 gap-4 mb-12'>
                        {imagesUrl.map((imgUrl) => (
                            <Image 
                                key={imgUrl}
                                src={imgUrl} 
                                className='py-2' 
                                alt={'prompt'} 
                                width={250} 
                                height={250} />
                                ))}
                        </section>
                    </>
                }
            </main>
        </>
    );
};

export default GeneratePage;

