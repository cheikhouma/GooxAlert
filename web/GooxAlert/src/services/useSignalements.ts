import { useState, useEffect } from 'react';
import { Signalement } from '../types/index';


export const useSignalements = () => {
    const [signalements, setSignalements] = useState<Signalement[]>([]);

    useEffect(() => {
        // Récupérer les signalements du localStorage au chargement
        const storedSignalements = localStorage.getItem('userSignalements');
        if (storedSignalements) {
            setSignalements(JSON.parse(storedSignalements));
        }
    }, []);

    const updateSignalements = (newSignalements: Signalement[]) => {
        setSignalements(newSignalements);
        localStorage.setItem('userSignalements', JSON.stringify(newSignalements));
    };

    const addSignalement = (newSignalement: Signalement) => {
        const updatedSignalements = [newSignalement, ...signalements];
        updateSignalements(updatedSignalements);
    };

    const updateSignalement = (updatedSignalement: Signalement) => {
        const updatedSignalements = signalements.map(s => 
            s.id === updatedSignalement.id ? updatedSignalement : s
        );
        updateSignalements(updatedSignalements);
    };

    const deleteSignalement = (signalementId: number) => {
        const updatedSignalements = signalements.filter(s => s.id !== signalementId);
        updateSignalements(updatedSignalements);
    };

    return {
        signalements,
        addSignalement,
        updateSignalement,
        deleteSignalement,
        updateSignalements
    };
};