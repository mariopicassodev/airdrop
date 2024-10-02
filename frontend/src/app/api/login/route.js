import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.username || !data.password) {
            return NextResponse.json(
                {
                    message: "Invalid data",
                },
                {
                    status: 400,
                }
            );
        }

        const passwordHash = process.env.PASSWORD_HASH;

        const isPasswordValid = await bcrypt.compare(data.password, passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    message: "Invalid password",
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json(
            {
                message: "User logged in",
                token: token,
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
