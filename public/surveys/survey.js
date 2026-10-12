/**
 * Survey Engine — shared form logic for HeiloProjects surveys.
 * Handles navigation, validation, conditional questions, and submission.
 */

class SurveyEngine {
    constructor(config = {}) {
        this.surveyId = config.surveyId || 'unknown';
        this.endpoint = config.endpoint || '';
        this.onComplete = config.onComplete || null;

        this.container = document.querySelector('.survey-container');
        if (!this.container) return;

        this.sections = Array.from(this.container.querySelectorAll('.survey-section'));
        this.currentIndex = 0;
        this.submitted = false;

        this._init();
    }

    _init() {
        this._buildProgressBar();
        this._buildNavigation();
        this._setupStartButton();
        this._setupConditionals();
        this._setupInputListeners();
        this._showSection(0);
    }

    // ==========================================
    // Progress Bar
    // ==========================================

    _buildProgressBar() {
        // Only count question sections (not intro/thankyou)
        this.questionSections = this.sections.filter(
            s => !s.classList.contains('survey-section--intro') &&
                 !s.classList.contains('survey-section--thankyou')
        );

        if (this.questionSections.length < 2) return;

        const bar = document.createElement('div');
        bar.className = 'survey-progress';
        bar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-track"><div class="progress-fill"></div></div>
                <div class="progress-labels">
                    ${this.questionSections.map((s, i) =>
                        `<span data-idx="${i}">${s.dataset.title || `Section ${i + 1}`}</span>`
                    ).join('')}
                </div>
            </div>
        `;

        document.body.insertBefore(bar, this.container.parentElement || this.container);
        this.progressBar = bar;
        this.progressFill = bar.querySelector('.progress-fill');
        this.progressLabels = Array.from(bar.querySelectorAll('.progress-labels span'));
    }

    _updateProgress() {
        if (!this.progressBar) return;

        const section = this.sections[this.currentIndex];
        const isIntro = section.classList.contains('survey-section--intro');
        const isThankyou = section.classList.contains('survey-section--thankyou');

        // Show/hide progress bar
        if (isIntro || isThankyou) {
            this.progressBar.classList.remove('visible');
            return;
        }

        this.progressBar.classList.add('visible');

        const qIdx = this.questionSections.indexOf(section);
        const pct = ((qIdx + 1) / this.questionSections.length) * 100;
        this.progressFill.style.width = pct + '%';

        this.progressLabels.forEach((label, i) => {
            label.classList.toggle('active', i === qIdx);
            label.classList.toggle('completed', i < qIdx);
        });
    }

    // ==========================================
    // Navigation
    // ==========================================

    _buildNavigation() {
        // Insert nav into each question section
        this.questionSections.forEach((section, idx) => {
            const isLast = idx === this.questionSections.length - 1;
            const nav = document.createElement('div');
            nav.className = 'survey-nav';
            nav.innerHTML = `
                <button class="survey-nav-btn survey-nav-btn--back" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>
                <button class="survey-nav-btn ${isLast ? 'survey-nav-btn--submit' : 'survey-nav-btn--next'}" type="button">
                    ${isLast ? 'Submit' : 'Next'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            `;
            section.appendChild(nav);

            const backBtn = nav.querySelector('.survey-nav-btn--back');
            const nextBtn = nav.querySelector('.survey-nav-btn--next, .survey-nav-btn--submit');

            // Hide back on first question section
            if (idx === 0) backBtn.classList.add('survey-nav-btn--hidden');

            backBtn.addEventListener('click', () => this._prev());
            nextBtn.addEventListener('click', () => {
                if (isLast) {
                    this._submit();
                } else {
                    this._next();
                }
            });
        });
    }

    _setupStartButton() {
        const btn = this.container.querySelector('.survey-start-btn');
        if (btn) {
            btn.addEventListener('click', () => this._next());
        }
    }

    _showSection(index) {
        this.sections.forEach(s => s.classList.remove('active'));
        this.sections[index].classList.add('active');
        this.currentIndex = index;
        this._updateProgress();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    _next() {
        const current = this.sections[this.currentIndex];

        // Validate current section (skip intro)
        if (!current.classList.contains('survey-section--intro')) {
            if (!this._validateSection(current)) return;
        }

        if (this.currentIndex < this.sections.length - 1) {
            this._showSection(this.currentIndex + 1);
        }
    }

    _prev() {
        if (this.currentIndex > 0) {
            this._showSection(this.currentIndex - 1);
        }
    }

    // ==========================================
    // Validation
    // ==========================================

    _validateSection(section) {
        let valid = true;
        const cards = section.querySelectorAll('.survey-card[data-required]');

        cards.forEach(card => {
            // Skip hidden conditional cards
            if (card.hidden) {
                card.classList.remove('error');
                return;
            }

            const radios = card.querySelectorAll('input[type="radio"]');
            const checkboxes = card.querySelectorAll('input[type="checkbox"]');
            const textInputs = card.querySelectorAll('textarea:not(.other-input), input[type="text"]:not(.other-input), input[type="email"]');
            const impDots = card.querySelectorAll('.importance-dots input[type="radio"]');

            let cardValid = false;

            if (radios.length > 0 && impDots.length === 0) {
                // Radio: at least one checked
                cardValid = Array.from(radios).some(r => r.checked);
            } else if (checkboxes.length > 0) {
                // Checkboxes: meet minimum selections
                const min = parseInt(card.dataset.minSelections || '1');
                const checked = Array.from(checkboxes).filter(c => c.checked).length;
                cardValid = checked >= min;
            } else if (impDots.length > 0) {
                // Importance grid: check each row has a selection
                const rows = card.querySelectorAll('.importance-row');
                const min = parseInt(card.dataset.minSelections || rows.length);
                let rated = 0;
                rows.forEach(row => {
                    if (row.querySelector('input:checked')) rated++;
                });
                cardValid = rated >= min;
            } else if (textInputs.length > 0) {
                // Text: non-empty
                cardValid = Array.from(textInputs).some(t => t.value.trim() !== '');
            } else {
                cardValid = true;
            }

            card.classList.toggle('error', !cardValid);
            if (!cardValid) valid = false;
        });

        if (!valid) {
            // Scroll to first error
            const firstError = section.querySelector('.survey-card.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return valid;
    }

    _setupInputListeners() {
        // Clear error state when user interacts
        this.container.addEventListener('change', (e) => {
            const card = e.target.closest('.survey-card');
            if (card) card.classList.remove('error');
        });

        this.container.addEventListener('input', (e) => {
            const card = e.target.closest('.survey-card');
            if (card) card.classList.remove('error');
        });
    }

    // ==========================================
    // Conditional Questions
    // ==========================================

    _setupConditionals() {
        const conditionals = this.container.querySelectorAll('[data-show-when]');

        conditionals.forEach(card => {
            const rule = card.dataset.showWhen;
            // Format: "qN=value" or "qN=value1,value2"
            const [name, values] = rule.split('=');
            const triggerValues = values.split(',');

            this.container.addEventListener('change', (e) => {
                if (e.target.name === name) {
                    const show = triggerValues.includes(e.target.value);
                    card.hidden = !show;
                    if (!show) {
                        // Clear inputs in hidden card
                        card.querySelectorAll('input, textarea, select').forEach(el => {
                            if (el.type === 'radio' || el.type === 'checkbox') {
                                el.checked = false;
                            } else {
                                el.value = '';
                            }
                        });
                    }
                }
            });
        });
    }

    // ==========================================
    // Response Collection
    // ==========================================

    _collectResponses() {
        const responses = {};
        const inputs = this.container.querySelectorAll('input, textarea, select');
        const processed = new Set();

        inputs.forEach(input => {
            const name = input.name;
            if (!name || name === 'website') return; // Skip honeypot
            if (input.closest('[hidden]')) return; // Skip hidden conditionals

            if (input.type === 'radio') {
                if (input.checked && !processed.has(name)) {
                    responses[name] = input.value;
                    processed.add(name);
                }
            } else if (input.type === 'checkbox') {
                if (!processed.has(name)) {
                    responses[name] = [];
                    processed.add(name);
                }
                if (input.checked) {
                    if (!Array.isArray(responses[name])) responses[name] = [];
                    responses[name].push(input.value);
                }
            } else {
                // Text, textarea, email, select
                if (input.value.trim()) {
                    responses[name] = input.value.trim();
                }
            }
        });

        // Nest importance grid values (q14_speed, q14_accuracy → q14: {speed, accuracy})
        const nested = {};
        Object.keys(responses).forEach(key => {
            const match = key.match(/^(q\d+)_(\w+)$/);
            if (match && typeof responses[key] === 'string' && /^\d+$/.test(responses[key])) {
                const [, parent, child] = match;
                if (!nested[parent]) nested[parent] = {};
                nested[parent][child] = parseInt(responses[key]);
                delete responses[key];
            }
        });
        Object.assign(responses, nested);

        return responses;
    }

    // ==========================================
    // Submission
    // ==========================================

    async _submit() {
        if (this.submitted) return;

        const current = this.sections[this.currentIndex];
        if (!this._validateSection(current)) return;

        // Check honeypot
        const honeypot = document.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) return; // Bot detected

        const submitBtn = current.querySelector('.survey-nav-btn--submit');
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"></circle>
            </svg>
            Submitting...
        `;

        const payload = {
            survey_id: this.surveyId,
            submitted_at: new Date().toISOString(),
            responses: this._collectResponses(),
            meta: {
                url: window.location.href,
                referrer: document.referrer || null,
                ua: navigator.userAgent
            }
        };

        try {
            if (this.endpoint) {
                const res = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            } else {
                // Development mode: log to console
                console.log('Survey response (no endpoint configured):', payload);
            }

            this.submitted = true;

            // Show thank you
            const thankyou = this.sections.find(s =>
                s.classList.contains('survey-section--thankyou')
            );
            if (thankyou) {
                this._showSection(this.sections.indexOf(thankyou));
            }

            if (this.onComplete) this.onComplete(payload);

        } catch (err) {
            console.error('Survey submission failed:', err);

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Show inline error
            let errEl = current.querySelector('.survey-submit-error');
            if (!errEl) {
                errEl = document.createElement('p');
                errEl.className = 'survey-submit-error';
                errEl.style.cssText = 'color: #ef4444; text-align: center; margin-top: 12px; font-size: 0.875rem;';
                current.querySelector('.survey-nav').before(errEl);
            }
            errEl.textContent = 'Something went wrong. Please try again.';
        }
    }
}
