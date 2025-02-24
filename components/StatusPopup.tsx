// components/StatusPopup.tsx
"use client";

import { Alert } from "./ui/alert";

export const StatusPopup = ({ status }: { status: string }) => {
    if (!status) return null;
    
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Alert className="shadow-lg">
                {status === 'saving' && '⏳ Saving to cloud...'}
                {status === 'success' && '✅ Saved successfully!'}
                {status === 'error' && '❌ Error saving to cloud'}
            </Alert>
        </div>
    );
};