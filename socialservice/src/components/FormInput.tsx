import React, { useState } from 'react';

interface FormInputProps {
    placeholder: string;
    className?: string;
    fieldName: string;
    validationRegex?: RegExp;
    errorMessage?: string;
}

export default function FormInput({ 
    placeholder, 
    className, 
    fieldName, 
    validationRegex, 
    errorMessage 
}: FormInputProps) {
    const [isValid, setIsValid] = useState(true);

    return (
        <>
            <input 
            type="text" 
            placeholder={placeholder} 
            className={`border border-black rounded-xl py-2 pl-4 my-2 mx-2 shadow-lg ${className} ${!isValid ? 'border-red-500' : ''}`}
            />
            {!isValid && errorMessage && (
            <div className="mt-2">
                <span className="text-red-500">{errorMessage}</span>
            </div>
            )}
        </>
    );
}