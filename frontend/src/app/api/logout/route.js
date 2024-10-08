import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(request) {
    try {
        cookies().set('session', '', { expires: Date.now() });

        return NextResponse.json(
            {
                message: "User logged out",
            },
            {
                status: 200,
            }
        );
    }
    catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
