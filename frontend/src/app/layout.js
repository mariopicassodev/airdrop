import "./globals.css";
import { Providers } from "./providers";
import AppProvider from "./context/AppContext";

export const metadata = {
    title: "Airdrop",
    description: "Airdrop MyToken",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}


