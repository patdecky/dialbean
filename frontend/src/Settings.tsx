import { useRef, useState } from 'react';
import { DialBeanLargeIcon } from './icons';
import { useDialBean } from './DialBeanContext';
import { ConfirmModal } from './modals';
import type { DialBeanSchema } from './types';
import { mergeImportedData } from './adapter';

const Settings = () => {
    const { exportData, importData, removeData } = useDialBean();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showImportWarning, setShowImportWarning] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // reset so re-selecting the same file still triggers onChange
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string) as DialBeanSchema;
                const merged = mergeImportedData(parsed);
                importData(merged);
                setImportError(null);
            } catch (err) {
                setImportError(err instanceof Error ? err.message : 'Failed to import file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            {showImportWarning && (
                <ConfirmModal
                    title="Importing data will replace all of your currently saved data. Are you sure you want to continue?"
                    okButton="Yes Import"
                    onConfirm={() => {
                        setShowImportWarning(false);
                        fileInputRef.current?.click();
                    }}
                    onCancel={() => setShowImportWarning(false)}
                />
            )}
            {showRemoveModal && (
                <ConfirmModal
                    title="Are you sure you want to remove all saved data? This action cannot be undone."
                    okButton="Yes Remove"
                    onConfirm={() => {
                        removeData();
                    }}
                    onCancel={() => setShowRemoveModal(false)}
                />
            )}
            <div className="w-full h-full p-4 flex flex-col gap-2">
                <div className="w-full flex  items-center justify-start gap-1 mb-2 landscape:mb-1">
                    <DialBeanLargeIcon />
                    <h1>About & Settings</h1>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="label">About:</div>
                    <p>
                        DialBean is an open-source project released under the GPLv3 license. You can find the source code, open issues, or contribute on GitHub at <a href="https://github.com/patdecky/dialbean" target="_blank" rel="noopener noreferrer">https://github.com/patdecky/dialbean</a>.
                    </p>
                    <p>
                        If you are interested in taking over or maintaining the project, contact <a href="mailto:patrikdecky@patrikdecky.com">patrikdecky@patrikdecky.com</a>.
                    </p>
                    <button onClick={exportData}>Export Data</button>
                    <button onClick={() => setShowImportWarning(true)}>Import Data</button>
                    <button onClick={() => setShowRemoveModal(true)}>Remove All Saved Data</button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={handleFileSelected}
                    />
                    {importError && <div className="error">{importError}</div>}
                </div>
            </div>
        </div>
    );
};

export default Settings;




