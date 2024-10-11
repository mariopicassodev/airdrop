import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from 'bcrypt';
import config from "@/config.json"


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

        const passwordHash = config.pass

        const isUserValid = data.username === config.user;
        const isPasswordValid = await bcrypt.compare(data.password, passwordHash);

        if (!isUserValid) {
            return NextResponse.json(
                {
                    message: "Invalid username",
                },
                {
                    status: 400,
                }
            );
        }

        if (!isPasswordValid ) {
            return NextResponse.json(
                {
                    message: "Invalid password",
                },
                {
                    status: 400,
                }
            );
        }

        // Encrypt with bcrypt and Set server side Cookies

        const encryptedSessionData = await bcrypt.hash(data.username + data.password, 10);
        const oneDay = 24 * 60 * 60 * 1000
        cookies().set('session', encryptedSessionData, { expires: Date.now() + oneDay });

        return NextResponse.json(
            {
                message: "User logged in",
            },
            {
                status: 200,
            }
        );
    }
    catch (error) {
        console.error(error);
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
