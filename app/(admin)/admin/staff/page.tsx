"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteStaffSchema } from "@/lib/schemas"; // Define this in your schemas
import { inviteStaffMember } from "@/lib/actions/auth";
import { UserPlus, Copy, Check, Loader2, Mail } from "lucide-react";
import { z } from "zod";

type InviteFormValues = z.infer<typeof InviteStaffSchema>;

export default function AdminStaffPage() {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(InviteStaffSchema),
  });

  const onSubmit = async (data: InviteFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("role", data.role);

    const result = await inviteStaffMember(formData);
    if (result.success && result.link) {
      setInviteLink(result.link);
      reset();
    } else {
      alert(result.error || "Failed to generate invite.");
    }
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Staff & Invites
        </h1>
        <p className="text-slate-500 font-medium">
          Onboard new journalists to the Kurunzi system.
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-pd-red/10 rounded-lg text-pd-red">
            <UserPlus size={20} />
          </div>
          <h2 className="font-bold text-slate-800">Invite New Staff Member</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Email Address
            </label>
            <input
              {...register("email")}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-pd-red transition-all font-medium"
              placeholder="journalist@kurunzi.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-bold">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Access Level
            </label>
            <select
              {...register("role")}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-pd-red font-bold appearance-none"
            >
              <option value="writer">Writer (Drafting only)</option>
              <option value="editor">Editor (Admin & Publishing)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Generate System Invite"
            )}
          </button>
        </form>

        {inviteLink && (
          <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase text-green-600">
                Active Invite Link
              </span>
              <span className="text-[10px] font-medium text-green-500 italic text-right leading-none">
                Expires in 7 days
              </span>
            </div>
            <div className="flex gap-2">
              <input
                aria-label="writer invite link"
                readOnly
                value={inviteLink}
                className="flex-1 bg-white border border-green-200 p-3 rounded-xl text-xs font-mono text-green-800"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 bg-white border border-green-200 rounded-xl text-green-600 hover:bg-green-100 transition-colors flex items-center gap-2 font-bold text-xs"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
