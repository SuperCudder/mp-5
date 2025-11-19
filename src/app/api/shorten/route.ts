import { NextRequest, NextResponse } from "next/server";
import getCollection, { shortenedURL } from "@/app/lib/mongodb";
/* check if original url is valid, makes sure destination exists */
function validUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false
    }
}
/* gets both the url and alias, checks if theyre in the ui, valid for alias or url  */
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { url, alias} = body;

    if (!url || !alias) {
        return NextResponse.json(
            { error: "URL and alias required" },
            { status: 400 });
    }

    if (encodeURIComponent(alias) !== alias) {
        return NextResponse.json(
            { error: "Invalid url alias: Use valid characters" },
            { status: 400 }
        );
    }

    try {
        if (!validUrl(url)) {
            return NextResponse.json(
                { error: "Invalid URL" },
                { status: 400 }
            );
        }

        const collection = await getCollection(shortenedURL); /* make api to mongo to check for dupe alias*/
        const existing = await collection.findOne({ alias });

        if (existing) {
            return NextResponse.json(
                { error: "Alias already exists, choose a new one." },
                { status: 400 }
            );
        }

        await collection.insertOne({ alias, url }); /* if unique set it as the alias*/
        return NextResponse.json({
            message: 'Success',
            alias
        });
    } catch (err: unknown) {
        console.error("An error occurred", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}