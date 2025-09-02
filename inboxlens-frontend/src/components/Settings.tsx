import DashboardNavigation from "@/components/DashboardNavigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import React, { useState } from "react";

const SECTIONS = [
  { key: "profile", label: "Personal Details" },
  { key: "preferences", label: "Preferences" },
  { key: "danger", label: "Danger Zone" },
];

// Preferences options (reuse from Preferences page)
const question1Options = [
  'Student - I’m in school or university and mostly care about academic, internship, or scholarship emails.',
  'Job Seeker - I’m actively looking for work and want to prioritize recruiter or company emails.',
  'Professional / Employee - I’m currently working and want to stay on top of work-related emails and industry updates.',
  'Entrepreneur / Freelancer - I manage my own business or freelance work and want to focus on client, contract, and invoice emails.',
  'Recruiter / HR Professional - I manage candidates or hiring and want alerts about applications, resumes, or interviews.',
  'General / Casual User - I just want to get summaries of my emails and notifications.'
];
const question2Options = [
  'Tech', 'Finance', 'Healthcare', 'Education', 'Retail', 'Media', 'Government', 'Other'
];
const question3Options = [
  'Job offers', 'Academic updates', 'Work projects', 'Client communications', 'Newsletters', 'Deals', 'Other'
];

const Settings = () => {
  const { user, authFetch, logout } = useAuth();
  const [section, setSection] = useState("profile");
  // Profile edit state
  const [editName, setEditName] = useState(user?.name ?? "");
  // const [editAvatar, setEditAvatar] = useState(user?.avatar ?? "");
  const [editingProfile, setEditingProfile] = useState(false);
  // Preferences state
  const [digest, setDigest] = useState("daily");
  const [language, setLanguage] = useState("en");
  const [prefs, setPrefs] = useState({
    q1: [],
    q2: [],
    q3: [],
    preferredTime: "",
  });

  // Danger zone dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
      const res = await authFetch(`${baseUrl}/api/profile/delete-account`, { method: "DELETE" });
      if (res.ok) {
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
      <DashboardNavigation user={user ?? { name: "", email: "", avatar: "" }} />
      <div className="flex flex-1 items-center justify-center p-4">
  <div className="w-[1300px] h-[500px] flex bg-card rounded-xl shadow-lg overflow-hidden mx-auto -mt-8">
          {/* Sidebar */}
          <nav className="w-56 bg-muted/40 border-r flex flex-col py-8 px-4 gap-2">
            <h2 className="text-lg font-bold mb-6">Settings</h2>
            {SECTIONS.map(s => (
              <button
                key={s.key}
                className={`text-left px-4 py-2 rounded transition-colors font-medium ${section === s.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setSection(s.key)}
              >
                {s.label}
              </button>
            ))}
          </nav>
          {/* Main Content */}
          <div className="flex-1 p-8 md:p-10 overflow-y-auto">
            {section === "profile" && (
              <>
                <h1 className="text-2xl font-bold mb-8 text-foreground">Personal Details</h1>
                <Card>
                  <CardContent className="p-8">
                    <CardTitle className="mb-4">Profile Details</CardTitle>
                    <div className="flex items-center gap-4 mb-4">
                      <FaUserCircle className="h-16 w-16 text-primary" />
                      <div>
                        {editingProfile ? (
                          <input
                            className="border rounded px-2 py-1 mb-2 w-48"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="Name"
                          />
                        ) : (
                          <div className="font-semibold">{user?.name ?? ""}</div>
                        )}
                        <div className="text-muted-foreground text-sm">{user?.email ?? ""}</div>
                      </div>
                    </div>
                    {editingProfile ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => setEditingProfile(false)}>Cancel</Button>
                        <Button size="sm" variant="default" onClick={() => setEditingProfile(false)}>Save</Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>Edit Profile</Button>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            {section === "preferences" && (
              <>
                <h1 className="text-2xl font-bold mb-8 text-foreground">Preferences</h1>
                <Card>
                  <CardContent className="p-8">
                    <div className="mb-6 flex items-center gap-12">
                      <label className="font-medium">Email Digest Frequency</label>
                      <select
                        className="border rounded px-2 py-1 min-w-[120px]"
                        value={digest}
                        onChange={e => setDigest(e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    <Button asChild variant="outline">
                      <a href="/preferences">Go to Preferences Page</a>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
            {section === "danger" && (
              <>
                <h1 className="text-2xl font-bold mb-8 text-red-600">Danger Zone</h1>
                <Card>
                  <CardContent className="p-8">
                    <CardTitle className="mb-4 text-red-600">Danger Zone</CardTitle>
                    <div className="mb-4 text-muted-foreground">
                      Deleting your account is <span className="text-red-600 font-semibold">irreversible</span>. All your data will be lost.
                    </div>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                      Delete Account
                    </Button>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                          <DialogDescription>
                            This action is <span className="text-red-600 font-semibold">irreversible</span>. All your data will be permanently deleted and cannot be recovered.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting} aria-busy={deleting}>
                            {deleting ? (
                              <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>
                                Deleting...
                              </span>
                            ) : "Delete Account"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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