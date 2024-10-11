'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import signIn from '@/app/services/signIn';

export default function SignInPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        const response = await signIn(data.username, data.password);
        if (response.status === 200) {
            router.push('/admin/dashboard');
        }
        else {
            const data = await response.json();
            alert(`${response.status}: ${data.message}`);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-4xl text-center">Admin</h1>
            <div className="flex flex-col justify-between items-center flex-grow">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4 mt-8">
                    <input
                        type="text"
                        placeholder="Username"
                        {...register('username', {
                            required: "This field is required",
                        })}
                        className="input input-primary input-bordered"
                    />
                    {errors.username && <span className="text-error">{errors.username.message}</span>}

                    <input
                        type="password"
                        placeholder="Password"
                        {...register('password', {
                            required: "This field is required",
                        })}
                        className="input input-primary input-bordered"
                    />
                    {errors.password && <span className="text-error">{errors.password.message}</span>}

                    <button type="submit" className="btn btn-primary">Sign In</button>
                </form>
            </div>
        </div>
    );
};
