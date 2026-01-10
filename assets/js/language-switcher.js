// Language Switcher for Special One Cars GmbH
(function () {
    'use strict';

    let translations = {};
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('selectedLanguage') || defaultLang;

    // Load translations from JSON file based on the selected language
    async function loadTranslations(lang) {
        // English is the default, no translation file needed
        if (lang === 'en') {
            translations = {};
            return;
        }
        try {
            const response = await fetch(`assets/translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Translation file for ${lang} not found.`);
            }
            translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            translations = {}; // Fallback to an empty object on error
        }
    }

    // Restore original text from attributes
    function restoreOriginals() {
        document.querySelectorAll('[data-original-text]').forEach(element => {
            element.textContent = element.getAttribute('data-original-text');
        });
        document.querySelectorAll('[data-original-placeholder]').forEach(element => {
            element.placeholder = element.getAttribute('data-original-placeholder');
        });
    }

    // Apply translations to the page
    function applyTranslations(lang) {
        // First, restore all text to default before applying new translations
        restoreOriginals();

        if (lang === 'en') {
            return; // Already restored to English
        }

        // Apply translations from the loaded JSON
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                if (!element.hasAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', element.textContent);
                }
                element.textContent = translations[key];
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key]) {
                if (!element.hasAttribute('data-original-placeholder')) {
                    element.setAttribute('data-original-placeholder', element.placeholder);
                }
                element.placeholder = translations[key];
            }
        });
    }

    // Update the language switcher buttons to display the current language
    function updateButtonText(lang) {
        const langText = lang.toUpperCase();
        document.querySelectorAll('.current-lang').forEach(span => {
            span.textContent = langText;
        });
         document.querySelectorAll('.mobile-current-lang').forEach(span => {
            span.innerHTML = `<i class="fas fa-globe"></i> ${langText}`;
        });
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
    async function switchLanguage(lang) {
        if (currentLang === lang) return;

        currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);

        await loadTranslations(lang);
        applyTranslations(lang);
        setActiveLanguage(lang);
        updateButtonText(lang);

        document.documentElement.lang = lang;
    }

    // Initialize language switcher
    async function init() {
        // Store original text for all translatable elements on first load
        document.querySelectorAll('[data-translate]').forEach(element => {
            if (!element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
            }
        });
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            if (!element.hasAttribute('data-original-placeholder')) {
                element.setAttribute('data-original-placeholder', element.placeholder);
            }
        });

        const savedLang = localStorage.getItem('selectedLanguage') || defaultLang;
        currentLang = savedLang;

        await loadTranslations(savedLang);

        applyTranslations(savedLang);
        setActiveLanguage(savedLang);
        updateButtonText(savedLang);
        document.documentElement.lang = savedLang;

        // Add click event listeners to language options
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', async function (e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                await switchLanguage(lang);
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
