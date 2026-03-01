import React, { useState, useEffect } from 'react';
import { X, Download, Upload, RotateCcw } from 'lucide-react';
import './SettingsPanel.css';

const SettingsPanel = ({ isOpen, onClose, theme, setTheme, themeColor, setThemeColor, messageWidth, setMessageWidth, showAvatars, setShowAvatars }) => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('sap-sage-settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            fontSize: 'medium',
            messageDensity: 'comfortable',
            animationsEnabled: true,
            autoScroll: true,
            enterToSend: true,
        };
    });

    useEffect(() => {
        localStorage.setItem('sap-sage-settings', JSON.stringify(settings));

        // Apply font size
        document.documentElement.style.setProperty(
            '--app-font-size',
            settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px'
        );

        // Apply message density
        document.documentElement.style.setProperty(
            '--message-spacing',
            settings.messageDensity === 'compact' ? '1rem' : settings.messageDensity === 'spacious' ? '2rem' : '1.5rem'
        );
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        const defaults = {
            fontSize: 'medium',
            messageDensity: 'comfortable',
            animationsEnabled: true,
            autoScroll: true,
            enterToSend: true,
        };
        setSettings(defaults);
        setTheme('dark');
    };

    const exportSettings = () => {
        const data = {
            theme,
            settings,
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sap-sage-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importSettings = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.theme) setTheme(data.theme);
                    if (data.settings) setSettings(data.settings);
                } catch (error) {
                    alert('Invalid settings file');
                }
            };
            reader.readAsText(file);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="settings-overlay" onClick={onClose} />
            <div className="settings-panel">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="settings-content">
                    {/* Theme Settings */}
                    <div className="setting-section">
                        <h3>Theme</h3>
                        <div className="setting-group">
                            <label>Color Scheme</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="light"
                                        checked={theme === 'light'}
                                        onChange={(e) => setTheme(e.target.value)}
                                    />
                                    <span>Light</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="dark"
                                        checked={theme === 'dark'}
                                        onChange={(e) => setTheme(e.target.value)}
                                    />
                                    <span>Dark</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="system"
                                        checked={theme === 'system'}
                                        onChange={(e) => setTheme(e.target.value)}
                                    />
                                    <span>System</span>
                                </label>
                            </div>
                        </div>

