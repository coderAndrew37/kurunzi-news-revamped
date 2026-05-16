// app/subscribe/page.tsx
import SubscribeForm from "./SubscribeForm";

export const metadata = {
  title: "Subscribe | Kurunzi Sports",
  description:
    "Get the best Kenyan sports news delivered to your inbox every morning.",
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb] py-16 px-4">
      <div className="max-w-[520px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1a5c38] text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            KURUNZI SPORTS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0d0d0d] mb-4">
            Never miss a story
          </h1>
          <p className="text-lg text-[#5c534a]">
            Daily sports briefing from Kenya and around the world. Straight to
            your inbox.
          </p>
        </div>

        <SubscribeForm />

        <p className="text-center text-xs text-[#9a8f7f] mt-10">
          We respect your inbox. Unsubscribe anytime.
        </p>
      </div>
    </main>
  );
}
