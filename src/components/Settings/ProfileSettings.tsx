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
import { API } from '@/config';

const ProfileSettings = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const stored = JSON.parse(localStorage.getItem("fluxUser") || "{}");
      if (!stored?.userId) return;

      try {
        const res = await fetch(`${API}/api/userinfo/user-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: stored.userId }),
        });
        const { data } = await res.json();
        
        // Update the user state with the response data
        setUser({ 
          ...data,
          userId: stored.userId // Ensure we keep the userId
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchUserData();
  }, []);

  const setUserData = async () => {
    if (!user) return;
    
    try {
      const res = await fetch(`${API}/api/userinfo/set-user-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const { data } = await res.json();
      
      // Update localStorage with new data
      const stored = JSON.parse(localStorage.getItem("fluxUser") || "{}");
      localStorage.setItem("fluxUser", JSON.stringify({
        ...stored,
        ...data
      }));

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await setUserData();

    localStorage.setItem("fluxUser", JSON.stringify(user));
    
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
    if (!user) return;
    
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

  if (!user) {
    return (
      <Card className="bg-card text-card-foreground">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Loading profile information...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          Update your profile details and personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4 md:w-1/3">
            <div className="relative group">
              <Avatar className="w-36 h-36 border-2 border-primary/20 shadow bg-background">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {user?.name?.charAt(0).toUpperCase()}
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
                  value={user.name || ""} 
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="h-11 bg-background"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  placeholder="e.g. Product Manager"
                  value={user.position || ""} 
                  onChange={(e) => setUser({ ...user, position: e.target.value })}
                  className="h-11 bg-background"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="email">Email</Label>
                <div className="h11">
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email || ""} 
                    disabled
                    className="flex-1 h-11 bg-muted/30"
                  />
                </div>
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself" 
                  value={user.bio || ""}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="min-h-[120px] resize-none bg-background"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="px-8" onClick={setUserData}>Save changes</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
