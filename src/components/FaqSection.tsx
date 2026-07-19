import { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Which formats and qualities does YTStream support?',
      answer: 'YTStream supports extraction into Video (MP4) format and Audio (MP3) format. Available video resolutions range from 1080p (Full HD) down to 360p, while audio bitrates range from ultra-clear 320 kbps down to 128 kbps.'
    },
    {
      question: 'Is there a limit on the number or size of downloads?',
      answer: 'No! YTStream is entirely free, requires no user registration, and has no throttling limits. You can download as many videos and audio tracks of any size or length as you want.'
    },
    {
      question: 'Does this tool work on mobile devices?',
      answer: 'Absolutely. YTStream is built with responsive mobile-first UI patterns, meaning it works beautifully on all Android, iPhone, tablet, and desktop browser environments without requiring any app installations.'
    },
    {
      question: 'How do I download audio tracks instead of video?',
      answer: 'Simply paste the video link, and in Step 1 select the "Audio (MP3)" format button. Select your preferred audio quality (we recommend 320kbps for music) and click "Get Download Link" to extract the high-fidelity sound stream.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-12 animate-fade-in">
      <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-sans font-bold text-slate-100 uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-black/20 border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  id={`faq-toggle-button-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition"
                >
                  <span className="text-xs sm:text-sm font-sans font-bold text-slate-200">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5 animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Understated trust badge */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-sans">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-500/50" />
            <span>Ad-Free Extraction</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-500/50" />
            <span>SSL Secured Socket Encryption</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-500/50" />
            <span>Standard Media Codecs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
