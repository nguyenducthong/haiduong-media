import Link from "@/components/link";
import { ArrowLeft, ExternalLink, Shield } from "lucide-react";
import { getLoggedInAdminUser } from "@/lib/admin-auth";
import { loadSiteContent } from "@/lib/site-content";
import AdminEditor from "./admin-editor";
import { AdminLogin } from "@/components/admin-login";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getLoggedInAdminUser();
  if (!user) {
    return <AdminLogin />;
  }

  const content = await loadSiteContent();

  return <AdminEditor initialContent={content} currentUser={user} />;
}

