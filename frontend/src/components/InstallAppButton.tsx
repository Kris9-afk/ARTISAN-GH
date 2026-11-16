import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function installInstructions() {
  const { userAgent, platform, maxTouchPoints } = navigator;
  const isAppleMobile = /iPhone|iPad|iPod/i.test(userAgent)
    || (platform === 'MacIntel' && maxTouchPoints > 1);
  if (isAppleMobile) return 'In Safari, tap Share, then choose Add to Home Screen.';
  if (/Android/i.test(userAgent)) return 'Open your browser menu and choose Install app or Add to Home screen.';
  return 'Use your browser’s install icon or menu and choose Install app.';
}

export function InstallAppButton({ className }: { className: string }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  });
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (outcome === 'accepted') setInstalled(true);
  };

  if (installed) return null;

  return (
    <>
      <button type="button" className={className} onClick={() => void install()} aria-label="Install app">
        <Download size={16} />
        <span className="hidden min-[360px]:inline lg:hidden xl:inline">Install app</span>
      </button>
      {showInstructions && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 p-4" role="presentation">
          <section
            className="w-full max-w-sm rounded-2xl bg-[#fff8ec] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-app-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="install-app-title" className="text-lg font-extrabold text-[#062a1f]">Install ARTISAN-GH</h2>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{installInstructions()}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 text-[#062a1f]"
                aria-label="Close install instructions"
              >
                <X size={18} />
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
