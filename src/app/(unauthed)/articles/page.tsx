// src/app/(unauthed)/articles/page.tsx

import { createServerClient } from "@/lib/pocketbase/server";
import Link from "next/link";

export default async function ArticlesPage() {
    const client = await createServerClient();
    const articles = await client.collection("articles").getFullList({
        sort: "-created",
    });

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Articles</h1>
            {articles.length === 0 && (
                <p className="text-gray-500">No articles found.</p>
            )}
            {articles.map((article) => (
                <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="border rounded p-4 flex flex-col gap-2 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-semibold">{article.title}</h2>
                    <p className="text-sm text-gray-400">
                        {new Date(article.created).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{article.content}</p>
                </Link>
            ))}
        </div>
    );
}