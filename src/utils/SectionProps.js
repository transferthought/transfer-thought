// Props shared by all sections
const SectionShared = {
    props: {
        topOuterDivider: {
            type: Boolean,
            default: false,
        },
        bottomOuterDivider: {
            type: Boolean,
            default: false,
        },
        topDivider: {
            type: Boolean,
            default: false,
        },
        bottomDivider: {
            type: Boolean,
            default: false,
        },
        hasBgColor: {
            type: Boolean,
            default: false,
        },
        invertColor: {
            type: Boolean,
            default: false,
        },
    },
};

// Default section props
export const SectionProps = {
    props: {
        ...SectionShared.props,
    },
};

// Section split props
export const SectionSplitProps = {
    props: {
        ...SectionShared.props,
        invertMobile: {
            type: Boolean,
            default: false,
        },
        invertDesktop: {
            type: Boolean,
            default: false,
        },
        alignTop: {
            type: Boolean,
            default: false,
        },
        imageFill: {
            type: Boolean,
            default: false,
        },
    },
};

// Section tiles props
export const SectionTilesProps = {
    props: {
        ...SectionShared.props,
        pushLeft: {
            type: Boolean,
            default: false,
        },
    },
};
