import React, { useState } from 'react';

interface Option {
    id: number;
    label: string;
}

const BatteryHistory: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    
    const options: Option[] = [
        { id: 1, label: 'Batería de 100 kwh' },
        { id: 2, label: 'Batería de 85 kwh' },
        { id: 3, label: 'Batería de 75 kwh' },
        { id: 4, label: 'Batería de 50 kwh' },
    ];

    const handleOptionChange = (option: Option) => {
        setSelectedOptions(prevOptions => {
            const isSelected = prevOptions.find(item => item.id === option.id);
            if (isSelected) {
                return prevOptions.filter(item => item.id !== option.id);
            } else {
                return [...prevOptions, option];
            }
        });
    };

    return (
        <div className="w-64 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg text-black mb-4">Historial de baterías : </h2>
            <div className="space-y-2">
                {options.map(option => (
                    <div key={option.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`option-${option.id}`}
                            checked={selectedOptions.some(item => item.id === option.id)}
                            onChange={() => handleOptionChange(option)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                            htmlFor={`option-${option.id}`}
                            className="ml-2 text-sm font-medium text-black"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            
            {selectedOptions.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="text-sm text-black font-medium">Seleccionadas:</p>
                        <ul className="mt-2 list-disc list-inside text-sm text-black">
                            {selectedOptions.map((option, index) => (
                                <li key={index}>{option.label}</li>
                            ))}
                         </ul>
                </div>
            )}

        </div>
    );
};

export default BatteryHistory;