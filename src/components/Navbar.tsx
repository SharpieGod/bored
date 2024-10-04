import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import DarkoButton from "./Darko/DarkoButton";
import { getServerAuthSession } from "~/server/auth";

const Navbar = async () => {
  const session = await getServerAuthSession();

  return (
    <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-text-800 bg-primary-900/40 px-24 text-xl backdrop-blur-xl">
      <Link className="text-2xl font-bold" href={"/"}>
        bored
      </Link>

      <ul className="flex items-center justify-between gap-8">
        <li>
          <Link href={"/about"}>
            <DarkoButton>About</DarkoButton>
          </Link>
        </li>
        {session?.user ? (
          <>
            <li>
              <Link href={`/account`}>
                <DarkoButton>Account</DarkoButton>
              </Link>
            </li>
            <li>
              <Link href={"/api/auth/signout"}>
                <DarkoButton variant="secondary">Logout</DarkoButton>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <SignInButton />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
