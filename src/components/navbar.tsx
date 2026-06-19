// src/components/navbar.tsx

"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { useUser } from "./pocketbase-provider";
import { useEffect, useState } from "react";

export function Navbar() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("👤 [NAVBAR] useUser() state:", {
      email: user?.email || "null",
      id: user?.id || "null",
      hasUser: !!user
    });
  }, [user]);

  return (
    <div className="bg-neutral text-neutral-content sticky top-0 z-50">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            PB + Next.js
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal gap-2">
            <li>
              <Link href="/articles" className="hover:bg-neutral-focus rounded-lg">
                Articles
              </Link>
            </li>

            {user && (
              <li>
                <Link
                  href="/my-tickets"
                  className="hover:bg-neutral-focus rounded-lg"
                >
                  🎫 Moje karte
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:bg-neutral-focus rounded-lg font-medium"
                  >
                    {user.email}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => logout()}
                    className="btn btn-error btn-sm btn-outline"
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="btn btn-ghost btn-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="navbar-end lg:hidden">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-neutral border-t border-neutral-focus">
          <ul className="menu menu-vertical p-4 gap-2">
            <li>
              <Link
                href="/articles"
                className="hover:bg-neutral-focus rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Articles
              </Link>
            </li>

            {/* Mobile: My Tickets link - samo za ulogovane */}
            {user && (
              <li>
                <Link
                  href="/my-tickets"
                  className="hover:bg-neutral-focus rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  🎫 Moje karte
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:bg-neutral-focus rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">{user.email}</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="btn btn-error btn-outline w-full"
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="btn btn-ghost w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="btn btn-primary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}