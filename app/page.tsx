import { auth } from "./auth";
import SignIn from "./components/sign-in";
import { SignOut } from "./components/sign-out";

export default async function Home() {
    const session = await auth();

    return (
        <>
            <div className="flex justify-between bg-red-400">
                <div className="m-3">
                    Hello 
                </div>
                <div className="m-3 flex gap-3">
                {!session?.user ? <SignIn /> : <SignOut />}
                {session?.user ? session.user.name : null}
                </div>
            </div>

        </>
    );
}
