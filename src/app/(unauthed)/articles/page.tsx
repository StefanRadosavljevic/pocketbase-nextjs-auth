// src/app/(unauthed)/articles/page.tsx

import { createServerClient } from "@/lib/pocketbase/server";
import Link from "next/link";

export default async function ArticlesPage() {
    const client = await createServerClient();
    const articles = await client.collection("articles").getFullList({
        sort: "-created",
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Articles</h1>

                {articles.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No articles found.</p>
                ) : (
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                prefetch={true}
                                className="block p-6 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm"
                            >
                                <time className="text-xs text-gray-500">
                                    {new Date(article.created).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </time>
                                <h2 className="text-xl font-semibold mt-2 mb-2 text-gray-900">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 line-clamp-2">
                                    {article.content}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}