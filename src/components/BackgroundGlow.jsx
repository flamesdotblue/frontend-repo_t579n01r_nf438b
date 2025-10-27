export default function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[40rem] rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-[36rem] rounded-full bg-sky-300/30 blur-3xl" />
    </div>
  );
}
