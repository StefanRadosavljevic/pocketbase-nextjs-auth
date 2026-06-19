// src/app/(authed)/my-tickets/page-client.tsx
"use client";

import { usePocketBase, useUser } from "@/components/pocketbase-provider";
import { TicketsResponse } from "@/lib/pocketbase/types";
import { useEffect, useState } from "react";

export function MyTicketsClient() {
    const pb = usePocketBase();
    const user = useUser();
    const [tickets, setTickets] = useState<TicketsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 🔧 Ako nema user-a, SAMO izađi - NE postavljaj loading=false!
        if (!user?.id) {
            return; // ← Ključna promena!
        }

        setError(null);

        pb.collection("tickets")
            .getFullList({
                filter: `user = "${user.id}"`,
                sort: "-created",
            })
            .then((data) => setTickets(data))
            .catch((err) => {
                if (err?.status === 0 && err?.message?.includes("autocancelled")) return;
                console.error("❌ Fetch error:", err);
                setError("Nismo uspeli da učitamo karte.");
            })
            .finally(() => setLoading(false)); // ← Samo ovde gasimo loading!
    }, [user?.id, pb]);

    // 🎯 Loading se prikazuje DOK GOD traje fetch ILI čekamo user-a
    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    // Error samo ako nema karata
    if (error && tickets.length === 0) {
        return (
            <div className="alert alert-error shadow-sm">
                <span>⚠️</span>
                <span>{error}</span>
            </div>
        );
    }

    // Empty state SAMO kad nije loading i stvarno nema karata
    if (tickets.length === 0) {
        return (
            <p className="py-8 text-center opacity-60">No tickets found.</p>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Tickets</h1>
                {loading && tickets.length > 0 && (
                    <span className="loading loading-spinner loading-xs text-primary"></span>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="card bg-base-200 shadow-sm">
                        <div className="card-body flex-row items-center justify-between p-4">
                            <div className="flex flex-col gap-1">
                                <h2 className="card-title text-base">{ticket.event_name}</h2>
                                <p className="text-sm opacity-60">
                                    {ticket.seat || "General admission"}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`badge badge-sm ${ticket.status === "confirmed" ? "badge-success" :
                                        ticket.status === "used" ? "badge-neutral" : "badge-warning"
                                    }`}>
                                    {ticket.status}
                                </span>
                                {ticket.date && (
                                    <span className="text-xs opacity-50">
                                        {new Date(ticket.date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}