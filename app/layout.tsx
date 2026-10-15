import type { Metadata } from "next";
import { Inspector } from "../components/inspector";
import "./globals.css";
export const metadata: Metadata = { title: "Studio Forma — architektura pro život", description: "Ukázkový web architektonického studia pro lokální editor Webik." };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="cs"><body>{children}<Inspector /></body></html>; }
