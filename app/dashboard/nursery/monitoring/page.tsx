import type { Metadata } from "next";
import ClientPage from "./_components/ClientPage";

export const metadata: Metadata = {
    title: "پایش نشاء",
};

export default function Page() {
    return <ClientPage />;
}
