"use client";
import React, { FC } from "react";
import DarkoButton from "./Darko/DarkoButton";
import { signIn } from "next-auth/react";

const SignInButton: FC = () => {
  return (
    <div>
      <DarkoButton variant="primary" onClick={() => signIn()}>
        Sign in
      </DarkoButton>
    </div>
  );
};

export default SignInButton;
