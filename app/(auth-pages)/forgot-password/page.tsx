import { forgotPasswordAction } from "@/app/actions";
import Link from "next/link";
import NarrowLayout from "@/components/layouts/NarrowLayout";

export default async function ForgotPassword(props: {
  searchParams: Promise<string>;
}) {
  const searchParams = await props.searchParams;
  return (
    <NarrowLayout>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="you@example.com" required />
          <button formAction={forgotPasswordAction}>Reset Password</button>
          {/* <FormMessage message={searchParams} /> */}
        </div>
      </form>
    </NarrowLayout>
  );
}
