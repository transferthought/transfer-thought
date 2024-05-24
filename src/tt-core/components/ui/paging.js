/* eslint-disable no-param-reassign */
/* global AFRAME, UI */

// TODO: maybe expose these in the scheme
import { throttle } from 'lodash';

const BUTTON_WIDTH = 0.2;
const BUTTON_HEIGHT = 0.1;
const PADDING = 0.05;

AFRAME.registerComponent('ui-paging', {
    schema: {
        intersectableClass: { default: 'interactable' },
        buttonScale: { type: 'number', default: 1 },
        buttonColor: { default: '#000' },
        nextButtonText: { default: 'Next' },
        previousButtonText: { default: 'Previous' },
    },
    init() {
        this.index = 0;
        this.children = this.el.getChildEntities().filter((child) => child.className.indexOf('paging-control') === -1);
        this.setupElements();
        this.updateVisiblePages();

        this.el.addEventListener('componentinitialized', this.handleComponentInitialized.bind(this));
        this.el.addEventListener('child-attached', this.handleChildAttached.bind(this));
        this.el.addEventListener('child-detached', this.handleChildDetached.bind(this));

        this.updateVisiblePages = throttle(this.updateVisiblePages, 50);
    },
    update() {
        // TODO check for changes in data rather than just a complete rerender
        this.setupElements();
        this.updateVisiblePages();
    },
    updateVisiblePages() {
        const self = this;
        if (this.index >= this.children.length) {
            this.index = 0;
        }

        this.children.forEach((child, index) => {
            child.setAttribute('visible', index === self.index);
        });
        this.showHideElements();
    },
    setupElements() {
        const geo = this.el.getAttribute('geometry');
        if (!geo) {
            return;
        }
        if (this.nextButton) {
            this.nextButton.remove();
        }
        if (this.previousButton) {
            this.previousButton.remove();
        }
        const widthDiff = (geo.width - BUTTON_WIDTH * this.data.buttonScale) / 2;
        const heightDiff = (geo.height - BUTTON_HEIGHT * this.data.buttonScale) / 2;

        this.nextButton = this.createButton(this.data.nextButtonText);
        this.nextButton.addEventListener('click', this.next.bind(this));
        this.nextButton.setAttribute('position', `${widthDiff - PADDING} ${-heightDiff + PADDING} .01`);

        this.previousButton = this.createButton(this.data.previousButtonText);
        this.previousButton.addEventListener('click', this.previous.bind(this));
        this.previousButton.setAttribute('position', `${-widthDiff + PADDING} ${-heightDiff + PADDING} .01`);

        this.el.appendChild(this.previousButton);
        this.el.appendChild(this.nextButton);
    },
    showHideElements() {
        const geo = this.el.getAttribute('geometry');
        if (!geo) {
            return;
        }
        const isNextButtonVisible = this.children.length > this.index + 1;
        if (isNextButtonVisible) {
            this.nextButton.setAttribute('visible', true);
            this.nextButton.classList.add(this.data.intersectableClass);
        } else {
            this.nextButton.setAttribute('visible', false);
            this.nextButton.classList.remove(this.data.intersectableClass);
        }
        const isPreviousButtonVisible = this.index > 0;
        if (isPreviousButtonVisible) {
            this.previousButton.setAttribute('visible', true);
            this.previousButton.classList.add(this.data.intersectableClass);
        } else {
            this.previousButton.setAttribute('visible', false);
            this.previousButton.classList.remove(this.data.intersectableClass);
        }
    },
    createButton(value) {
        const button = document.createElement('a-plane');
        button.setAttribute('class', `paging-control ${this.data.intersectableClass}`);
        button.setAttribute('shader', 'flat');
        button.setAttribute('width', BUTTON_WIDTH);
        button.setAttribute('height', BUTTON_HEIGHT);
        button.setAttribute('color', '#0C2156');
        button.setAttribute('ui-btn', true);
        button.setAttribute('scale', `${this.data.buttonScale} ${this.data.buttonScale} ${this.data.buttonScale}`);
        button.setAttribute('text', `value: ${value}; height: 1; width:1; align: center;`);
        button.setAttribute('visible', false);
        return button;
    },
    next(e) {
        this.index += 1;
        this.update();
        UI.utils.preventDefault(e);
    },
    previous(e) {
        this.index -= 1;
        this.update();
        UI.utils.preventDefault(e);
    },
    /**
     * Event Handlers
     */
    handleComponentInitialized(e) {
        if (e.detail && e.detail.name === 'geometry') {
            this.setupElements();
            this.update();
        }
    },
    handleChildAttached(evt) {
        // Only update if direct child attached.
        const eventEl = evt.detail.el;
        if (eventEl.parentNode !== this.el || eventEl.className.indexOf('paging-control') > -1) { return; }
        this.children.push(evt.detail.el);
        this.update();
    },
    handleChildDetached(evt) {
        // Only update if direct child detached.
        if (this.children.indexOf(evt.detail.el) === -1) { return; }
        this.children.splice(this.children.indexOf(evt.detail.el), 1);
        this.update();
    },
});
