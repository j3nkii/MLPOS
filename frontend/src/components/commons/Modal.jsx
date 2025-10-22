import React, { useCallback, useEffect } from "react";
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@components';



export const Modal = ({ children, onClose, className }) => {

    const handleKeyDown = (evt) => {
        if(evt.key === 'Escape') onClose();
    }

    useEffect(() => {
        const { addEventListener, removeEventListener } = document;
        addEventListener('keydown', handleKeyDown);
        return () => {
            removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div 
            className={`fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50`}
            onClick={handleBackdropClick}
        >
            <div className={`border-black bg-white rounded-lg w-3/6 mx-4 overflow-hidden ${className || ''}`}>
                {children}
            </div>
        </div>
    );
}



export const ModalHeader = ({ onClose, title }) => {
    return (
        <div className="flex items-center justify-between pt-8 px-4 text-black">
            <div className="flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={25} />
                <h2 className="text-2xl font-semibold">
                    {title || 'Modal Title'}
                </h2>
            </div>
            <Button type={'iconDanger'} onClick={onClose} >
                <X size={20} />
            </Button>
        </div>
    );
}



export const ModalBody = ({ children }) => {
    return (
        <div className='pb-6 pt-3 px-0'>
            {children}
        </div>
    )
}



export const ModalFooter = ({ children }) => {
    return (
        <div className="flex gap-3 p-4 bg-[#bfbfbf] text-white">
            {children}
        </div>
    );
}