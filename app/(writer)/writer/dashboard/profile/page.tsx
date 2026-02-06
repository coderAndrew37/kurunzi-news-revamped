"use client";

import { useState, useEffect } from "react";
import { uploadMediaAction } from "@/lib/actions/media";
import { Camera, Loader2, Save, User } from "lucide-react";
import { createClient } from "@/lib/utils/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
    twitter_handle: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadMediaAction(formData);

    if (result.success && result.url) {
      setProfile({ ...profile, avatar_url: result.url });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user?.id, ...profile, updated_at: new Date() });

    if (error) alert(error.message);
    else alert("Profile updated!");
    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-10">
        <Loader2 className="animate-spin text-pd-red" />
      </div>
    );

  return (
    <div className="max-w-2xl">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Your Identity</h1>
        <p className="text-slate-500">
          This information will be visible to readers on published articles.
        </p>
      </header>

      <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <User size={40} />
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="text-white" size={20} />
              <input
                aria-label="avatar upload"
                type="file"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Profile Picture</h4>
            <p className="text-xs text-slate-400">JPG or PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
              Display Name
            </label>
            <input
              aria-label="display name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-pd-red font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
              Short Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-pd-red text-sm"
              placeholder="Tell the readers about your expertise..."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
