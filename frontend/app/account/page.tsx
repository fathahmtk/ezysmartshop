import { AccountPageClient } from "@/components/account-page-client";

export const metadata = {
  title: "Account",
  robots: {
    index: false,
    follow: false
  }
};

export default function AccountPage() {
  return <AccountPageClient />;
}
