import { useState } from "react";

export default function useForm(initialValues = {}) {
    const [formData, setFormData] = useState(initialValues);

    // Function to handle input changes dynamically
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Function to reset form to its initial state
    const resetForm = () => {
        setFormData(initialValues);
    };

    return {
        formData,
        handleInputChange,
        resetForm,
        setFormData, // To allow manual setting of formData if needed
    };
}
