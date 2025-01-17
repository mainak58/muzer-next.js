import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const YT_REGEX = new RegExp(
    "?:https?://(?:www.)?youtube.com/(?:watch?v=|(?:v|e(?:mbed)?)/))([a-zA-Z0-9_-]{11}"
);

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);

        if (!isYt) {
            return NextResponse.json(
                {
                    message: "wrong url pasted",
                },
                {
                    status: 404,
                }
            );
        }

        const extractedId = data.url.split("?v=")[1];

        await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    "error while adding stream, please chcek api/streams post function",
            },
            {
                status: 411,
            }
        );
    }
}
