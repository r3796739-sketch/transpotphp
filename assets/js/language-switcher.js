// Language Switcher for Special One Cars GmbH
(function () {
    'use strict';

    let translations = {};
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('selectedLanguage') || defaultLang;

    // Load translations from JSON file
    async function loadTranslations() {
        try {
            const response = await fetch('assets/translations/de.json');
            translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    // Apply translations to the page
    function applyTranslations(lang) {
        if (lang === 'en') {
            // Reload page to reset to English (original content)
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                if (element.hasAttribute('data-original-text')) {
                    element.textContent = element.getAttribute('data-original-text');
                }
            });

            const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
            placeholderElements.forEach(element => {
                if (element.hasAttribute('data-original-placeholder')) {
                    element.placeholder = element.getAttribute('data-original-placeholder');
                }
            });

            const titleElement = document.querySelector('title');
            if (titleElement && titleElement.hasAttribute('data-original-text')) {
                titleElement.textContent = titleElement.getAttribute('data-original-text');
            }

            const metaDescriptionElement = document.querySelector('meta[name="description"]');
            if (metaDescriptionElement && metaDescriptionElement.hasAttribute('data-original-text')) {
                metaDescriptionElement.content = metaDescriptionElement.getAttribute('data-original-text');
            }
            return;
        }

        // Apply German translations
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                // Store original text if not already stored
                if (!element.hasAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', element.textContent);
                }
                element.textContent = translations[key];
            }
        });

        // Translate placeholders
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key]) {
                // Store original placeholder if not already stored
                if (!element.hasAttribute('data-original-placeholder')) {
                    element.setAttribute('data-original-placeholder', element.placeholder);
                }
                element.placeholder = translations[key];
            }
        });

        // Translate title and meta description
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const key = titleElement.getAttribute('data-translate');
            if (translations[key]) {
                if (!titleElement.hasAttribute('data-original-text')) {
                    titleElement.setAttribute('data-original-text', titleElement.textContent);
                }
                titleElement.textContent = translations[key];
            }
        }

        const metaDescriptionElement = document.querySelector('meta[name="description"]');
        if (metaDescriptionElement) {
            const key = metaDescriptionElement.getAttribute('data-translate');
            if (translations[key]) {
                if (!metaDescriptionElement.hasAttribute('data-original-text')) {
                    metaDescriptionElement.setAttribute('data-original-text', metaDescriptionElement.content);
                }
                metaDescriptionElement.content = translations[key];
            }
        }
    }

    // Set active language in UI
    function setActiveLanguage(lang) {
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            }
        });
    }

    // Switch language
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        applyTranslations(lang);
        setActiveLanguage(lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    // Initialize language switcher
    async function init() {
        await loadTranslations();

        // Apply saved language preference
        applyTranslations(currentLang);
        setActiveLanguage(currentLang);
        document.documentElement.lang = currentLang;

        // Add click event listeners to language options
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', function (e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();