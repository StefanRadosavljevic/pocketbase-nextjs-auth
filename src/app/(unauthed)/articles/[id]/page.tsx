// src/app/(unauthed)/articles/[id]/page.tsx

import { createServerClient } from "@/lib/pocketbase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const client = await createServerClient();

    let article;
    try {
        article = await client.collection("articles").getOne(id);
    } catch {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4">
            <Link href="/articles" className="text-sm text-gray-400 hover:underline">
                ← Back to articles
            </Link>
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <p className="text-sm text-gray-400">
                {new Date(article.created).toLocaleDateString()}
            </p>
            <p className="text-gray-600">{article.content}</p>
        </div>
    );
}