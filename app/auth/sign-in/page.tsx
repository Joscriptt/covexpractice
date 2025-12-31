"use client";

import React, { useState } from "react";
import { Github } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import LoadingButton from "@/components/loading-button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SignInPage() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="grow flex flex-col items-center justify-center gap-4 p-8 text-center">
      <Card className="w-full max-w-xs shadow">
        <CardHeader className="text-cente">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <LoadingButton
                onClick={() => {
                  setIsLoading(true);
                  // yes, I know this returns a Promise, and I intentionally don't want to handle it
                  void signIn("github", {
                    redirectTo: "/",
                  });
                }}
                className="w-full font-semibold"
                isLoading={isLoading}
              >
                <Github className="mr-2" />
                Login with Github
              </LoadingButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInPage;
