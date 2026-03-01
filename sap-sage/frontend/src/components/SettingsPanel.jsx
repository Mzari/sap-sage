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
        setTheme('light');
        setThemeColor('default');
    };

    const exportSettings = () => {
        const data = {
            theme,
            themeColor,
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
                    if (data.themeColor) setThemeColor(data.themeColor);
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

                        {/* Light Theme Colors */}
                        {theme !== 'dark' && (
                            <div className="setting-group">
                                <label>Theme Color</label>
                                <div className="color-grid">
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="default"
                                            checked={themeColor === 'default'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#2563eb' }}></div>
                                        <span>Default</span>
                                    </label>
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="warm"
                                            checked={themeColor === 'warm'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#ea580c' }}></div>
                                        <span>Warm</span>
                                    </label>
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="cool"
                                            checked={themeColor === 'cool'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#0ea5e9' }}></div>
                                        <span>Cool</span>
                                    </label>
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="sage"
                                            checked={themeColor === 'sage'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#059669' }}></div>
                                        <span>Sage</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Dark Theme Colors */}
                        {theme === 'dark' && (
                            <div className="setting-group">
                                <label>Theme Color</label>
                                <div className="color-grid">
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="deepblue"
                                            checked={themeColor === 'deepblue'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#42a5f5' }}></div>
                                        <span>Deep Blue</span>
                                    </label>
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="charcoal"
                                            checked={themeColor === 'charcoal'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#818cf8' }}></div>
                                        <span>Charcoal</span>
                                    </label>
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="purple"
                                            checked={themeColor === 'purple'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#c084fc' }}></div>
                                        <span>Purple</span>
                                    </label>
                                    <label className="color-option">
                                        <input
                                            type="radio"
                                            name="themeColor"
                                            value="midnight"
                                            checked={themeColor === 'midnight'}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                        />
                                        <div className="color-swatch" style={{ background: '#34d399' }}></div>
                                        <span>Midnight</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Display Settings */}
                    <div className="setting-section">
                        <h3>Display</h3>
                        <div className="setting-group">
                            <label>Font Size</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="fontSize"
                                        value="small"
                                        checked={settings.fontSize === 'small'}
                                        onChange={(e) => updateSetting('fontSize', e.target.value)}
                                    />
                                    <span>Small</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="fontSize"
                                        value="medium"
                                        checked={settings.fontSize === 'medium'}
                                        onChange={(e) => updateSetting('fontSize', e.target.value)}
                                    />
                                    <span>Medium</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="fontSize"
                                        value="large"
                                        checked={settings.fontSize === 'large'}
                                        onChange={(e) => updateSetting('fontSize', e.target.value)}
                                    />
                                    <span>Large</span>
                                </label>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label>Message Width</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageWidth"
                                        value="narrow"
                                        checked={messageWidth === 'narrow'}
                                        onChange={(e) => setMessageWidth(e.target.value)}
                                    />
                                    <span>Narrow</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageWidth"
                                        value="default"
                                        checked={messageWidth === 'default'}
                                        onChange={(e) => setMessageWidth(e.target.value)}
                                    />
                                    <span>Default</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageWidth"
                                        value="wide"
                                        checked={messageWidth === 'wide'}
                                        onChange={(e) => setMessageWidth(e.target.value)}
                                    />
                                    <span>Wide</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageWidth"
                                        value="full"
                                        checked={messageWidth === 'full'}
                                        onChange={(e) => setMessageWidth(e.target.value)}
                                    />
                                    <span>Full</span>
                                </label>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label>Message Density</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageDensity"
                                        value="compact"
                                        checked={settings.messageDensity === 'compact'}
                                        onChange={(e) => updateSetting('messageDensity', e.target.value)}
                                    />
                                    <span>Compact</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageDensity"
                                        value="comfortable"
                                        checked={settings.messageDensity === 'comfortable'}
                                        onChange={(e) => updateSetting('messageDensity', e.target.value)}
                                    />
                                    <span>Comfortable</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="messageDensity"
                                        value="spacious"
                                        checked={settings.messageDensity === 'spacious'}
                                        onChange={(e) => updateSetting('messageDensity', e.target.value)}
                                    />
                                    <span>Spacious</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Behavior Settings */}
                    <div className="setting-section">
                        <h3>Behavior</h3>
                        <div className="setting-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={showAvatars}
                                    onChange={(e) => setShowAvatars(e.target.checked)}
                                />
                                <span>Show Assistant Avatar</span>
                            </label>
                        </div>
                        <div className="setting-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.animationsEnabled}
                                    onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
                                />
                                <span>Enable Animations</span>
                            </label>
                        </div>
                        <div className="setting-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.autoScroll}
                                    onChange={(e) => updateSetting('autoScroll', e.target.checked)}
                                />
                                <span>Auto-scroll to New Messages</span>
                            </label>
                        </div>
                        <div className="setting-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={settings.enterToSend}
                                    onChange={(e) => updateSetting('enterToSend', e.target.checked)}
                                />
                                <span>Press Enter to Send (Shift+Enter for new line)</span>
                            </label>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="setting-section">
                        <h3>Data Management</h3>
                        <div className="setting-actions">
                            <button onClick={exportSettings} className="action-btn">
                                <Download size={18} />
                                <span>Export Settings</span>
                            </button>
                            <label className="action-btn">
                                <Upload size={18} />
                                <span>Import Settings</span>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={importSettings}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <button onClick={resetSettings} className="action-btn danger">
                                <RotateCcw size={18} />
                                <span>Reset to Defaults</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;
