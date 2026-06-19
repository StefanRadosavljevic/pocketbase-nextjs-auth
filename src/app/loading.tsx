// src/app/loading.tsx
export default function GlobalLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="p-6 bg-white rounded-xl border border-gray-100 animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-100 animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}