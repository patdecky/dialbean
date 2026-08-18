import { IndexedDBAdapter, LocalStorageAdapter, type StorageAdapter } from "./adapter";


export interface StorageStatus {
    adapter: StorageAdapter;
    isPersisted: boolean;
    isStandalonePWA: boolean;
    shouldPromptPWA: boolean;
}

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

    // Prompt the user to install PWA if storage isn't persisted or running standalone
    const shouldPromptPWA = !isStandalonePWA && !isPersisted;

    return {
        adapter,
        isPersisted,
        isStandalonePWA,
        shouldPromptPWA,
    };
}


import React, { useState, useEffect, useRef } from 'react';
import { DialBeanLargeIcon } from "./icons";
import { XActionIcon } from "./action_icons";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPwaBanner: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIos, setIsIos] = useState<boolean>(false);
    const [showIosInstructions, setShowIosInstructions] = useState<boolean>(false);
    const [confirmedLossOfData, setConfirmedLossOfData] = useState<boolean>(false);
    const [isWaitingForPrompt, setIsWaitingForPrompt] = useState<boolean>(false);

    // Ref keeps track of the waiting state across asynchronous event listeners without stale closures
    const isWaitingRef = useRef<boolean>(false);
    isWaitingRef.current = isWaitingForPrompt;

    useEffect(() => {
        // Detect iOS Safari
        const ua = window.navigator.userAgent;
        const isIosDevice = /iphone|ipad|ipod/i.test(ua);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsIos(isIosDevice);

        // Listen for Android/Chrome native PWA install event
        const handleBeforeInstallPrompt = async (e: Event) => {
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);

            // If user tapped "Install App" before Android Chrome fired this event:
            if (isWaitingRef.current) {
                setIsWaitingForPrompt(false);
                await promptEvent.prompt();
                const { outcome } = await promptEvent.userChoice;
                setDeferredPrompt(null);
                if (outcome === 'accepted' && onDismiss) {
                    onDismiss();
                }
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [onDismiss]);

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
            // Chrome hasn't fired the event yet -> set waiting state to auto-trigger when it fires
            setIsWaitingForPrompt(true);
        }
    };

    const handleClose = () => {
        if (confirmedLossOfData && onDismiss) {
            onDismiss();
        }
    };

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
                <div className="text-sm text-bg1/90 bg-bg1/10 rounded-lg p-2.5 leading-relaxed">
                    Your recipes and brews are stored strictly on this device and are available offline. However, unless DialBean is installed to your Home Screen, your browser or mobile OS may automatically clear your data to save space.
                </div>

                {/* iOS Instructions Accordion */}
                {showIosInstructions && isIos && (
                    <div className="text-xs text-fg2 bg-fg2 rounded-xl p-3 border border-fg3 flex flex-col gap-1.5 animate-fadeIn">
                        <p className="flex items-center gap-1.5 font-medium text-bg2">
                            1. Tap the Share button <span className="text-base">⎋</span>
                        </p>
                        <p className="flex items-center gap-1.5 font-medium text-bg2">
                            2. Scroll down & select <strong className="text-bg2">"Add to Home Screen"</strong>
                        </p>
                    </div>
                )}

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

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 inverse bg-bg2 border-bg3 rounded-md py-2 text-xs font-medium transition-colors shadow-sm"
                    >
                        {isIos
                            ? showIosInstructions
                                ? 'Hide Instructions'
                                : 'How to Install on iOS'
                            : isWaitingForPrompt
                                ? 'Opening Installer...'
                                : 'Install App'}
                    </button>

                    <button
                        onClick={handleClose}
                        disabled={!confirmedLossOfData}
                        className="px-4 py-2 text-xs font-medium text-bg1 bg-bg1/20 border border-bg1/30 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
    
};