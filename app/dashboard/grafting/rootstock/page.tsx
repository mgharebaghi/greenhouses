import type { Metadata } from "next";
import ClientPage from "./_components/ClientPage";

export const metadata: Metadata = {
    title: "اطلاعات گیاه پایه",
};

export default function Page() {
    return <ClientPage />;
}
