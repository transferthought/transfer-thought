import { throttle } from 'lodash';

const ScrollReveal = {
    data() {
        return {
            viewportHeight: window.innerHeight,
            revealEl: null,
        };
    },
    methods: {
        getElements() {
            this.revealEl = document.querySelectorAll('[class*=reveal-]');
        },
        checkComplete() {
            return (
                this.revealEl.length
        <= document.querySelectorAll('[class*=reveal-].is-revealed').length
            );
        },
        elementIsVisible(el, offset) {
            return (
                el.getBoundingClientRect().top <= this.viewportHeight - offset
            );
        },
        revealElements() {
            if (this.checkComplete()) return;
            for (let i = 0; i < this.revealEl.length; i += 1) {
                const el = this.revealEl[i];
                const revealDelay = el.getAttribute('data-reveal-delay');
                const revealOffset = el.getAttribute('data-reveal-offset')
                    ? el.getAttribute('data-reveal-offset')
                    : '200';
                const listenedEl = el.getAttribute('data-reveal-container')
                    ? el.closest(el.getAttribute('data-reveal-container'))
                    : el;
                if (
                    this.elementIsVisible(listenedEl, revealOffset)
          && !el.classList.contains('is-revealed')
                ) {
                    if (revealDelay && revealDelay !== 0) {
                        setTimeout(() => {
                            el.classList.add('is-revealed');
                        }, revealDelay);
                    } else {
                        el.classList.add('is-revealed');
                    }
                }
            }
        },
        init() {
            setTimeout(() => {
                this.getElements();
                if (!this.checkComplete()) {
                    window.addEventListener('scroll', this.handleScroll);
                    window.addEventListener('resize', this.handleResize);
                }
                this.revealElements();
            }, 100);
        },
        handleListeners() {
            if (!this.checkComplete()) return;
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('resize', this.handleResize);
        },
        handleScroll() {
            this.handleListeners();
            this.revealElements();
        },
        handleResize() {
            this.viewportHeight = window.innerHeight;
            this.handleListeners();
            this.revealElements();
        },
    },
    created() {
        this.handleScroll = throttle(this.handleScroll, 30);
        this.handleResize = throttle(this.handleResize, 30);
    },
    mounted() {
    // this.$nextTick(() => {
        this.init();
        // });
        // Re-init on route change
        if (this.$router) {
            this.$watch('$route', () => {
                // this.$nextTick(() => {
                this.init();
                // });
            });
        }
        // Re-init on hot reload (for development purposes only)
        // https://webpack.js.org/api/hot-module-replacement/#addstatushandler
        if (module.hot) {
            module.hot.accept();
            module.hot.addStatusHandler((status) => {
                if (status === 'idle') this.init();
            });
        }
    },
};

export default ScrollReveal;
