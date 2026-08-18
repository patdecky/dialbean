import { DialBeanLargeIcon } from './icons';

const Settings = () => {

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-full h-full p-4 flex flex-col gap-2">
                <div className="w-full flex  items-center justify-start gap-1 mb-2 landscape:mb-1">
                    <DialBeanLargeIcon />
                    <h1>About & Settings</h1>
                </div>
                
            </div>
        </div>
    );
};

export default Settings;




