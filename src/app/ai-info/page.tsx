export default function AIInfoPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter">AI ENGINE INFO</h1>
      <div className="space-y-6">
        <div className="p-6 bg-white border border-gray-200 rounded-[2rem]">
          <h2 className="font-bold text-indigo-600 uppercase text-xs mb-2">Primary Model</h2>
          <p className="text-xl font-bold text-gray-800">Llama 3.3 70B Versatile</p>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            This model provides state-of-the-art reasoning and high-speed generation for your study materials.
          </p>
        </div>
        
        <div className="p-6 bg-white border border-gray-200 rounded-[2rem]">
          <h2 className="font-bold text-green-600 uppercase text-xs mb-2">Study Algorithm</h2>
          <p className="text-xl font-bold text-gray-800">SM-2 Spaced Repetition</p>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Our platform uses the SuperMemo-2 algorithm to schedule reviews at the exact moment you are likely to forget.
          </p>
        </div>
      </div>
    </div>
  );
}