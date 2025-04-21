
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";
import { ProfilePictureUploader } from "@/components/Settings/ProfilePictureUploader";

const ProfileSettings = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("fluxUser") || '{"name":"User", "email":"user@example.com", "role":"Admin", "position":"Product Manager", "avatar":""}');
  });

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("fluxUser", JSON.stringify(user));
    
    // Update user level data if it exists for consistency
    const userLevelData = localStorage.getItem("fluxUserLevel");
    if (userLevelData) {
      const userLevel = JSON.parse(userLevelData);
      userLevel.username = user.name;
      localStorage.setItem("fluxUserLevel", JSON.stringify(userLevel));
    }
    
    addActivity({
      type: "profile_updated",
      details: "Updated user profile settings",
      timestamp: new Date().toISOString(),
    });
    
    toast.success("Profile updated successfully");
  };

  const updateProfilePicture = (imageUrl: string) => {
    setUser({ ...user, avatar: imageUrl });
    const updatedUser = {...user, avatar: imageUrl};
    localStorage.setItem("fluxUser", JSON.stringify(updatedUser));
    
    addActivity({
      type: "avatar_updated",
      details: "Updated profile picture",
      timestamp: new Date().toISOString(),
    });
    
    toast.success("Profile picture updated successfully");
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile details and personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4 md:w-1/3">
            <div className="relative group">
              <Avatar className="w-36 h-36 border-2 border-primary/20 shadow">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <ProfilePictureUploader onUpload={updateProfilePicture}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </ProfilePictureUploader>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Click to upload a new photo
            </p>
          </div>
          
          <form onSubmit={updateProfile} className="flex-1 space-y-6">
            <div className="grid gap-5">
              <div className="grid gap-2.5">
                <Label htmlFor="name">Full name</Label>
                <Input 
                  id="name" 
                  value={user.name} 
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  placeholder="e.g. Product Manager"
                  value={user.position || ""} 
                  onChange={(e) => setUser({ ...user, position: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-3">
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email} 
                    disabled
                    className="flex-1 h-11 bg-muted/30"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.dispatchEvent(new CustomEvent('settings:open-email-dialog'))}
                    className="h-11"
                  >
                    Change
                  </Button>
                </div>
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself" 
                  value={user.bio || ""}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="px-8">Save changes</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
