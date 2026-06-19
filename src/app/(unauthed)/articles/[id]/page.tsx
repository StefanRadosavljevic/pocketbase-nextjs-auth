// src/app/(unauthed)/articles/[id]/page.tsx

import { createServerClient } from "@/lib/pocketbase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ArticlePage({
    params,
}: {
    params: { id: string };
}) {
    const client = await createServerClient();

    try {
        const article = await client.collection("articles").getOne(params.id);

        return (
            <article className="min-h-screen bg-white py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Link
                        href="/articles"
                        prefetch={true}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span>Back to articles</span>
                    </Link>

                    <header className="mb-8">
                        <time className="text-sm text-gray-500">
                            {new Date(article.created).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </time>
                        <h1 className="text-3xl font-bold mt-3 text-gray-900">
                            {article.title}
                        </h1>
                    </header>

                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {article.content}
                    </div>
                </div>
            </article>
        );
    } catch {
        notFound();
    }
}