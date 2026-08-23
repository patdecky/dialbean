import { getStorageDontShowAgainFlag, IndexedDBAdapter, LocalStorageAdapter, setStorageDontShowAgainFlag, type StorageAdapter } from "./adapter";
import React, { useState, useEffect } from 'react';
import { DialBeanLargeIcon } from "./icons";
import { XActionIcon } from "./action_icons";


export interface StorageStatus {
    adapter: StorageAdapter;
    isPersisted: boolean;
    isStandalonePWA: boolean;
    shouldPromptPWA: boolean;
}

// Kept under its own localStorage key so it never depends on (or gets wiped alongside) the
// IndexedDB-backed brew data.



// eslint-disable-next-line react-refresh/only-export-components
export async function initStorageEngine(): Promise<StorageStatus> {
    // Check if app is running as an installed PWA (iOS Safari / Android Chrome)
    const isStandalonePWA =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true;

    let isPersisted = false;

    // Request persistent storage if browser API exists
    if (navigator.storage && navigator.storage.persist) {
        isPersisted = await navigator.storage.persist();
    }

    // Use IndexedDB if available; fallback to LocalStorage if completely unsupported
    const hasIndexedDB = typeof window !== 'undefined' && 'indexedDB' in window;
    const adapter: StorageAdapter = hasIndexedDB
        ? new IndexedDBAdapter()
        : new LocalStorageAdapter();

    // Once the user dismissed the prompt for good, never show it again - regardless of what
    // happens to isPersisted (e.g. it can flip back to false after the IndexedDB is wiped).
    const dontShowAgain = await getStorageDontShowAgainFlag();
    const shouldPromptPWA = !isStandalonePWA && !isPersisted && !dontShowAgain;

    return {
        adapter,
        isPersisted,
        isStandalonePWA,
        shouldPromptPWA,
    };
}


interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPwaBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIos, setIsIos] = useState<boolean>(false);
    const [showIosInstructions, setShowIosInstructions] = useState<boolean>(false);
    const [showAndroidInstructions, setShowAndroidInstructions] = useState<boolean>(false);
    const [confirmedLossOfData, setConfirmedLossOfData] = useState<boolean>(false);
    const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
    const [hasCheckedDontShowAgain, setHasCheckedDontShowAgain] = useState<boolean>(false);


    useEffect(() => {
        const getLossOfData = async () => {
            const dismissed = await getStorageDontShowAgainFlag();
            if (dismissed) {
                onDismiss();
            }
            setHasCheckedDontShowAgain(true);
        }
        getLossOfData();
    },[]);

    useEffect(() => {
        
        // Detect iOS Safari
        const ua = window.navigator.userAgent;
        const isIosDevice = /iphone|ipad|ipod/i.test(ua);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsIos(isIosDevice);

        // Listen for Android/Chrome native PWA install event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIos) {
            setShowIosInstructions((prev) => !prev);
            return;
        }
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            if (outcome === 'accepted' && onDismiss) {
                onDismiss();
            }
        } else {
            // Browser hasn't fired beforeinstallprompt (or doesn't support it) -> show manual
            // instructions instead of waiting indefinitely for an event that may never come.
            setShowAndroidInstructions((prev) => !prev);
        }
    };

    const handleClose = () => {
        if (confirmedLossOfData && onDismiss) {
            if (dontShowAgain) {
                setStorageDontShowAgainFlag(true);
            }
            onDismiss();
        }
    };

    if (!hasCheckedDontShowAgain) {
        return null; // Don't render until we've checked the "don't show again" flag
    }

    return (
        <div className="fixed inset-0 z-5000 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-fg1 border border-fg2 rounded-xl p-4 shadow-2xl/40 flex flex-col gap-3 max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] flex items-center justify-center shrink-0">
                            <DialBeanLargeIcon />
                        </div>
                        <div>
                            <h4 className="font-semibold text-bg1">Install DialBean</h4>
                            <p className="text-xs text-bg1">Keep your data safe & enable offline mode</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={!confirmedLossOfData}
                        className="bg-transparent rounded-full p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Close"
                    >
                        <XActionIcon size={16} strokeColor="var(--color-bg1)" />
                    </button>
                </div>

                {/* Data Warning Message */}
                <div className="text-sm text-bg2 bg-fg2 rounded-lg p-3 border border-fg3 leading-relaxed">
                    Your recipes and brews are stored strictly on this device and are available offline. However, unless DialBean is installed to your Home Screen, your browser or mobile OS may automatically clear your data to save space.
                </div>


                {/* Acknowledgment Checkbox */}
                <label className="flex items-center gap-2 text-sm text-bg1 cursor-pointer select-none pt-1">
                    <input
                        type="checkbox"
                        checked={confirmedLossOfData}
                        onChange={(e) => setConfirmedLossOfData(e.target.checked)}
                        className="rounded border-fg2 text-bg1 focus:ring-0"
                    />
                    <span>I understand that my data might be lost if I do not install.</span>
                </label>
                <label className={"flex items-center gap-2 text-sm text-bg1 cursor-pointer select-none pt-1" + (confirmedLossOfData ? "" : " opacity-50 cursor-not-allowed")}>
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="rounded border-fg2 text-bg1 focus:ring-0"
                        disabled={!confirmedLossOfData}
                    />
                    <span>Do not show this again.</span>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 inverse"
                    >
                        {isIos
                            ? showIosInstructions
                                ? 'Hide Instructions'
                                : 'How to Install on iOS'
                            : !deferredPrompt && showAndroidInstructions
                                ? 'Hide Instructions'
                                : (!deferredPrompt ? 'How to Install on Android' : 'Install App')}
                    </button>

                    <button
                        onClick={handleClose}
                        disabled={!confirmedLossOfData}
                        className="outline disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Proceed
                    </button>
                </div>

                {/* iOS Instructions Accordion */}
                {showIosInstructions && isIos && (
                    <div className="text-xs text-fg2 bg-fg2 rounded-lg p-3 border border-fg3 flex flex-col gap-1.5">
                        <p className="flex items-center gap-1.5 font-medium text-bg2">
                            1. Tap the Share button <span className="text-base">⎋</span>
                        </p>
                        <p className="flex items-center gap-1.5 font-medium text-bg2">
                            2. Scroll down & select <strong className="text-bg2">"Add to Home Screen"</strong>
                        </p>
                    </div>
                )}

                {/* Android Instructions Accordion */}
                {!isIos && !deferredPrompt && showAndroidInstructions && (
                    <div className="text-xs text-fg2 bg-fg2 rounded-lg p-3 border border-fg3 flex flex-col gap-1.5">
                        <p className="flex items-center gap-1.5 font-medium text-bg2">
                            1. Tap the <strong className="text-bg2">⋮</strong> menu button in Chrome
                        </p>
                        <p className="flex items-center gap-1.5 font-medium text-bg2">
                            2. Select <strong className="text-bg2">"Install app"</strong> or <strong className="text-bg2">"Add to Home screen"</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

};