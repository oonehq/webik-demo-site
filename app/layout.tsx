import type { Metadata } from "next";
import { Inspector } from "../components/inspector";
import "./globals.css";
export const metadata: Metadata = { title: "Nerd Pottery", description: "Nerd Pottery — keramická dílna a hrnečky inspirované Pánem prstenů. Ukázková prezentace pro Webik." };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="cs"><body>{children}<Inspector /></body></html>; }
