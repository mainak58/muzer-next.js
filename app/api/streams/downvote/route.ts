import { auth } from "@/app/auth";
import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string(),
});

export async function GET(req: NextRequest) {
    const session = await auth();

    // FIXME: in docs it is prisma instead of prismaClient
    const user = await prismaClient.user?.findFirst({
        where: {
            email: session?.user?.email ?? "",
        },
    });

    if (!user) {
        return NextResponse.json(
            {
                message: "User is not authenticated",
            },
            {
                status: 404,
            }
        );
    }

    try {
        const data = UpvoteSchema.parse(req.json());
        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: data.streamId,
                },
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Please check api/streams/downstream",
            },
            {
                status: 404,
            }
        );
    }
}
