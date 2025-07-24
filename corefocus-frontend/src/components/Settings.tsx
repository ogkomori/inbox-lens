

import DashboardNavigation from "@/components/DashboardNavigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { FaUserCircle } from "react-icons/fa";

const Settings = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation user={user ?? { name: "", email: "", avatar: "" }} />
      <main className="container mx-auto px-4 pt-32 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>

        {/* Profile Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Profile Details</CardTitle>
            <div className="flex items-center gap-4 mb-4">
              <FaUserCircle className="h-16 w-16 text-primary" />
              <div>
                <div className="font-semibold">{user?.name ?? ""}</div>
                <div className="text-muted-foreground text-sm">{user?.email ?? ""}</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Preferences</CardTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span>Enable notifications</span>
                <input type="checkbox" className="accent-primary" defaultChecked />
              </div>
            <div className="flex items-center justify-between">
              <span>Dark mode</span>
              <input type="checkbox" className="accent-primary" defaultChecked disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="mb-4 text-red-600">Danger Zone</CardTitle>
          <div className="mb-4 text-muted-foreground">
            Deleting your account is irreversible. All your data will be lost.
          </div>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </main>
  </div>
  );
};

export default Settings;