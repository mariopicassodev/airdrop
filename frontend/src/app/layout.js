import "./globals.css";
import AppProvider from "../context/AppContext";

export const metadata = {
    title: "Airdrop",
    description: "Airdrop MyToken",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ overflow: 'hidden' }}>
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
}


