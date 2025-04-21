
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";

const SettingsDialogs = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  useEffect(() => {
    const handleOpenEmailDialog = () => setShowEmailDialog(true);
    const handleOpenPasswordDialog = () => setShowPasswordDialog(true);
    
    document.addEventListener('settings:open-email-dialog', handleOpenEmailDialog);
    document.addEventListener('settings:open-password-dialog', handleOpenPasswordDialog);
    
    return () => {
      document.removeEventListener('settings:open-email-dialog', handleOpenEmailDialog);
      document.removeEventListener('settings:open-password-dialog', handleOpenPasswordDialog);
    };
  }, []);
  
  const handleEmailChange = () => {
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }
    
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    // Here you would verify the current password with an API call
    // For now, we'll just simulate success
    const user = JSON.parse(localStorage.getItem("fluxUser") || '{}');
    user.email = newEmail;
    localStorage.setItem("fluxUser", JSON.stringify(user));
    
    addActivity({
      type: "email_changed",
      details: "Updated email address",
      timestamp: new Date().toISOString(),
    });
    
    toast.success("Email updated successfully");
    setShowEmailDialog(false);
    setCurrentPassword("");
    setNewEmail("");
  };
  
  const handlePasswordChange = () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    // Here you would verify the current password and update with an API call
    // For now, we'll just simulate success
    addActivity({
      type: "password_changed",
      details: "Updated account password",
      timestamp: new Date().toISOString(),
    });
    
    toast.success("Password updated successfully");
    setShowPasswordDialog(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      {/* Email Change Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Enter your new email address and current password to verify your identity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="your-new-email@example.com"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="verifyPassword">Current Password</Label>
              <Input
                id="verifyPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailChange}>
              Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and set a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsDialogs;
