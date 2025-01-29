import { useState, useEffect } from 'react';

export const useSearch = (initialData, setData, fields, delay = 300) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) {
                const filtered = initialData.filter((item) =>
                    fields.some((field) => {
                        // Cek apakah field merupakan properti bersarang (seperti nama_gedung dalam gedung)
                        if (field.includes('.')) {
                            const [parentField, childField] = field.split('.');
                            return (
                                item[parentField]?.[childField]
                                    ?.toString()
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            );
                        } else {
                            // Cek untuk field yang tidak bersarang
                            return item[field]
                                ?.toString()
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase());
                        }
                    })
                );
                setData(filtered);
            } else {
                setData(initialData);
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, initialData, fields, setData, delay]);

    return { searchTerm, setSearchTerm };
};
