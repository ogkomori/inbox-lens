import DashboardNavigation from "@/components/DashboardNavigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const SECTIONS = [
  { key: "profile", label: "Personal Details" },
  { key: "preferences", label: "Preferences" },
  { key: "danger", label: "Danger Zone" },
];

const Settings = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const { user, authFetch, logout } = useAuth();
  const [section, setSection] = useState("profile");
  // Profile edit state
  const [editName, setEditName] = useState(user?.name ?? "");
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  // Avatar state removed
  const [editingProfile, setEditingProfile] = useState(false);
  // Preferences state (removed, not needed here)
  // Danger zone dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${backendUrl}/api/profile/delete-account`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        // Show success toast and log out
        toast({
          title: "Account deleted successfully",
          description: "Your account has been permanently deleted.",
          className: "bg-green-500 text-white",
        });
        setDeleteDialogOpen(false);
        setTimeout(() => {
          logout();
        }, 1200);
      } else {
        toast({
          title: "Failed to delete account",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "An error occurred while deleting your account.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavigation user={user ?? { name: "", email: "" }} />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-[1300px] h-[500px] flex bg-card rounded-xl shadow-lg overflow-hidden mx-auto -mt-8">
          {/* Sidebar */}
          <nav className="w-56 bg-muted/40 border-r flex flex-col py-8 px-4 gap-2">
            <h2 className="text-lg font-bold mb-6">Settings</h2>
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                className={`text-left px-4 py-2 rounded transition-colors font-medium ${
                  section === s.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => {
                  if (s.key === "preferences") {
                    window.location.href = "/preferences";
                  } else {
                    setSection(s.key);
                  }
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>
          {/* Main Content */}
          <div className="flex-1 p-8 md:p-10 overflow-y-auto">
            {section === "profile" && (
              <>
                <h1 className="text-2xl font-bold mb-8 text-foreground">
                  Personal Details
                </h1>
                <Card>
                  <CardContent className="p-8">
                    <CardTitle className="mb-4">Profile Details</CardTitle>
                    <div className="flex items-center gap-4 mb-4">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt="User avatar"
                          className="h-16 w-16 rounded-full object-cover border border-muted"
                        />
                      ) : (
                        <FaUserCircle className="h-16 w-16 text-primary" />
                      )}
                      <div className="flex items-center gap-2">
                        {editingProfile ? (
                          <input
                            className="border rounded px-2 py-1 mb-2 w-48"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                          />
                        ) : (
                          <>
                            <div className="font-semibold">{displayName}</div>
                            <button
                              className="ml-2 p-1 rounded hover:bg-muted"
                              aria-label="Edit name"
                              onClick={() => setEditingProfile(true)}
                            >
                              <FaPencilAlt className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {user?.email ?? ""}
                      </div>
                    </div>
                    {editingProfile && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setEditingProfile(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `${backendUrl}/api/profile/set-name/${encodeURIComponent(
                                  editName
                                )}`,
                                {
                                  method: "PATCH",
                                  credentials: "include",
                                }
                              );
                              if (!res.ok) throw new Error("Failed to update name");
                              setDisplayName(editName);
                              setEditingProfile(false);
                            } catch (e) {
                              // Optionally show error to user
                            }
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            {section === "danger" && (
              <>
                <h1 className="text-2xl font-bold mb-8 text-red-600">
                  Danger Zone
                </h1>
                <Card>
                  <CardContent className="p-8">
                    <CardTitle className="mb-4 text-red-600">
                      Danger Zone
                    </CardTitle>
                    <div className="mb-4 text-muted-foreground">
                      Deleting your account is{" "}
                      <span className="text-red-600 font-semibold">
                        irreversible
                      </span>
                      . All your data will be lost.
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete Account
                    </Button>
                    {/* Danger zone dialog logic remains unchanged */}
                    {deleteDialogOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full">
                          <h2 className="text-lg font-bold mb-4 text-red-600">
                            Confirm Deletion
                          </h2>
                          <p className="text-sm text-muted-foreground mb-4">
                            Are you sure you want to delete your account? This
                            action is irreversible and all your data will be lost.
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                            >
                              {deleting ? "Deleting..." : "Delete Account"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;