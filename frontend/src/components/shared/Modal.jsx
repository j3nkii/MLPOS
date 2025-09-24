import React from "react";
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@components';



export const Modal = ({ children, onClose, className }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget)
            onClose();
    };
    return (
        <div 
            className={`fixed inset-0 bg-black/22 flex items-center justify-center z-50`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-white rounded-lg shadow-xl w-3/6 mx-4 overflow-hidden ${className || ''}`}>
                {children}
            </div>
        </div>
    );
}



export const ModalHeader = ({ onClose, title }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                    {title || 'Modal Title'}
                </h2>
            </div>
            <Button type={'iconDanger'} onClick={onClose} >
                <X size={20} />
            </Button>
        </div>
    );
}



export const ModalFooter = ({ children }) => {
    return (
        <div className="flex gap-3 p-4 border-t bg-gray-50">
            {children}
        </div>
    );
}