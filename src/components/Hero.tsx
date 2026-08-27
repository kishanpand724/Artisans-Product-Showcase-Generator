import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Editorial Heading & Subtext */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#1A1A1A] opacity-30"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-50 text-[#1A1A1A]">
                Step 01: Multi-Angle Upload
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light leading-[1.08] text-[#1A1A1A] tracking-tight mb-6">
              Transform <br className="hidden sm:inline" />
              Craft into <br className="hidden sm:inline" />
              <span className="italic font-normal">Couture.</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed opacity-75 text-[#1A1A1A] max-w-md font-normal">
              Upload 2 to 3 high-resolution photos of your handcrafted item from different perspectives. 
              Our neural engine maps geometry and textures into an ultra-refined product showcase.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 pt-2 border-t border-black/5">
            <span>Pottery & Ceramics</span>
            <span>•</span>
            <span>Leather Craft</span>
            <span>•</span>
            <span>Jewelry & Wood</span>
          </div>
        </div>

        {/* Right 3-Step Process Card Container */}
        <div className="lg:col-span-6">
          <div className="bg-white/60 backdrop-blur-md rounded-[32px] sm:rounded-[40px] border border-black/5 p-6 sm:p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/40 mb-6">
              Studio Process Workflow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-black/5 flex flex-col justify-between h-40 group hover:border-black/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-white text-[#1A1A1A] font-bold text-xs flex items-center justify-center shadow-xs">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Upload Photos
                  </h4>
                  <p className="text-[11px] text-[#1A1A1A]/60 leading-snug">
                    2 to 3 images from distinct angles.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-black/5 flex flex-col justify-between h-40 group hover:border-black/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-white text-[#1A1A1A] font-bold text-xs flex items-center justify-center shadow-xs">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Tag Angles
                  </h4>
                  <p className="text-[11px] text-[#1A1A1A]/60 leading-snug">
                    Assign Front, Side, or Detail views.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#1A1A1A] text-white flex flex-col justify-between h-40 shadow-md">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                    Showcase AI
                  </h4>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Unlocks at 2+ uploaded images.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
