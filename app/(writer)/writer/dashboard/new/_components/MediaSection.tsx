"use client";

import Image from "next/image";
import { ImageIcon, X, Info } from "lucide-react";
import { WriterDraft } from "@/types/editor";

interface Props {
  article: WriterDraft;
  onUpload: (file: File) => void;
  updateField: (fields: Partial<WriterDraft>) => void;
  canEdit: boolean;
}

export default function MediaSection({
  article,
  onUpload,
  updateField,
  canEdit,
}: Props) {
  const metaFields = [
    { id: "imageAlt", label: "Alt Text", icon: true },
    { id: "imageCaption", label: "Caption", icon: false },
    { id: "imageSource", label: "Source", icon: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
      <div className="lg:col-span-3">
        {article.featuredImage ? (
          <div className="relative group rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl border-8 border-slate-50">
            <Image
              src={article.featuredImage as string}
              alt="Feature"
              className="object-cover"
              fill
              priority
            />
            {canEdit && (
              <button
                aria-label="remove featured image"
                onClick={() => updateField({ featuredImage: null })}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur p-3 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 transition-all cursor-pointer group ${!canEdit && "opacity-50 cursor-not-allowed"}`}
          >
            <div className="bg-white p-6 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon
                size={40}
                className="text-slate-300 group-hover:text-red-400"
              />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              Upload Master Media
            </span>
            <input
              type="file"
              className="hidden"
              disabled={!canEdit}
              onChange={(e) =>
                e.target.files?.[0] && onUpload(e.target.files[0])
              }
              accept="image/*"
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {metaFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
              {field.label} {field.icon && <Info size={10} />}
            </label>
            <input
              disabled={!canEdit}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] outline-none focus:bg-white transition-all disabled:opacity-50"
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              value={(article as any)[field.id] || ""}
              onChange={(e) => updateField({ [field.id]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
