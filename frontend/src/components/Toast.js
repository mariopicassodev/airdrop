'use client';
import { useEffect } from 'react';

export default function Toast({ message, type, visible, onClose }) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Close the toast after 3 seconds

            return () => clearTimeout(timer); // Clear the timeout if the component unmounts
        }
    }, [visible, onClose]);


    console.log('Toast:', message, type, visible);

    if (!visible) return null;

    if (type === "error") {
        return (
            <div className="toast toast-bottom toast-end z-50">
                <div className="alert alert-error">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    else if (type === "success") {
        console.log('success toast');
        return (
            <div className="toast toast-bottom toast-end z-50">
                <div className="alert alert-success">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    else if (type === "warning") {
        return (
            <div className="toast toast-bottom toast-end z-50">
                <div className="alert alert-warning">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    return null;
}
