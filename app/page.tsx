import HeroScroller from "@/components/HeroScroller";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <main className="relative w-full">
      <Preloader />
      <HeroScroller />

      {/* Spacer for further content (e.g. 50vh or more) if needed, 
          but HeroScroller has 400vh internal height so it handles the length.
          The user might want more sections later. */}
      {/* <div className="h-screen flex items-center justify-center bg-[#2b1d12] text-white">
        Next Section Placeholder
      </div> */}
    </main>
  );
}
