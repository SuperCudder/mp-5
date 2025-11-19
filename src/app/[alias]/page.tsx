import { redirect } from 'next/navigation';
import getCollection, { shortenedURL } from '@/app/lib/mongodb';
/* this is the page where users are sent if their alias is not found, otherwise, redirect to their url */
export default async function RedirectPage({ params }: { params: Promise<{ alias: string }> }) {
    const { alias } = await params;

    const collection = await getCollection(shortenedURL);
    const data = await collection.findOne({ alias });

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">404</h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Alias not found</p>
                </div>
            </div>
        );
    }

    redirect(data.url);
}
