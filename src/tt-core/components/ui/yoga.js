/* eslint-disable */
/* global AFRAME,Yoga */
/**
 * Yogo Layout Engine mapped to a Component for aframe-material-collection - https://yogalayout.com
 * @namespace aframe-material-collection
 * @component ui-yoga
 * @author Shane Harris
 */

if (typeof Yoga === 'undefined') {
    throw 'ui-yoga component requires the Yoga Layout Engine to be loaded - https://yogalayout.com';
}
// Map yoga enums to frendly names.
// TODO: Need to expose the padding/border/margin side as seperate options to allow for combinations.
module.exports = AFRAME.registerComponent('ui-yoga', {
    schema: {
        alignContent: { default: 'flex-start' },
        alignItems: { default: 'auto' },
        alignSelf: { default: 'auto' },
        display: { default: 'default' },
        flex: { type: 'number', default: 1 },
        flexDirection: { default: 'row' },
        flexWrap: { default: 'default' },
        aspectRatio: { default: 'default' },
        overflow: { default: 'default' },
        justifyContent: { default: 'start' },
        border: { type: 'int', default: 0 },
        borderLeft: { type: 'int', default: 0 },
        borderRight: { type: 'int', default: 0 },
        borderTop: { type: 'int', default: 0 },
        borderBottom: { type: 'int', default: 0 },
        padding: { type: 'int', default: 0 },
        paddingLeft: { type: 'int', default: 0 },
        paddingRight: { type: 'int', default: 0 },
        paddingTop: { type: 'int', default: 0 },
        paddingBottom: { type: 'int', default: 0 },
        margin: { type: 'int', default: 0 },
        marginLeft: { type: 'int', default: 0 },
        marginRight: { type: 'int', default: 0 },
        marginTop: { type: 'int', default: 0 },
        marginBottom: { type: 'int', default: 0 },
        marginAuto: { type: 'boolean', default: false },
        marginAutoLeft: { type: 'boolean', default: false },
        marginAutoRight: { type: 'boolean', default: false },
        marginAutoTop: { type: 'boolean', default: false },
        marginAutoBottom: { type: 'boolean', default: false },
        marginPercent: { type: 'number', default: 0 },
        marginPercentLeft: { type: 'int', default: 0 },
        marginPercentRight: { type: 'int', default: 0 },
        marginPercentTop: { type: 'int', default: 0 },
        marginPercentBottom: { type: 'int', default: 0 },
        flexBasis: { default: 'default' },
        flexBasisPercent: { type: 'number', default: 0 },
        flexGrow: { type: 'number', default: 0 },
        flexShrink: { type: 'number', default: 1 },
        maxHeight: { default: 'default' },
        minHeight: { default: 'default' },
        maxWidth: { default: 'default' },
        minWidth: { default: 'default' },
        maxHeightPercent: { default: 'default' },
        minHeightPercent: { default: 'default' },
        maxWidthPercent: { default: 'default' },
        minWidthPercent: { default: 'default' },
        position: { default: 'default' },
        positionLeft: { type: 'int', default: 0 },
        positionRight: { type: 'int', default: 0 },
        positionTop: { type: 'int', default: 0 },
        positionBottom: { type: 'int', default: 0 },
        positionPercent: { default: 'default' },
        positionPercentLeft: { type: 'int', default: 0 },
        positionPercentRight: { type: 'int', default: 0 },
        positionPercentTop: { type: 'int', default: 0 },
        positionPercentBottom: { type: 'int', default: 0 },
        width: { default: 'default' },
        height: { default: 'default' },
        widthAuto: { type: 'boolean', default: false },
        heightAuto: { type: 'boolean', default: false },
        widthPercent: { default: 'default' },
        heightPercent: { default: 'default' },
    },
    init() {
        this.el.getYogaProperties = this.getProperties.bind(this);
        this.setProperties();
    },
    updateSchema() {
        this.setProperties();
    },
    setProperties() {
        this.properties = this.properties || [];
        this.properties.length = 0;
        // Store the current valid yoga properties;
        for (const name in this.data) {
            if (this.data.hasOwnProperty(name)
                && this.data[name] !== 'default' && this.data[name]) {
                const value = this.mapPropertyToEnum(name);
                if (value) this.properties.push({ method: `set${name.charAt(0).toUpperCase()}${name.substr(1)}`, value: this.mapPropertyToEnum(name) });
            }
        }
    },
    getProperties() {
        // Get the current yoga properties array as an object
        const propertiesObj = {};
        for (let i = 0; i < this.properties.length; i++) {
            propertiesObj[this.properties[i].method] = this.properties[i];
        }
        return propertiesObj;
    },
    mapPropertyToEnum(name) {
        // Get the yoga enum for the friendly name.
        switch (true) {
        case name.indexOf('align') > -1:
            return this.enums.align[this.data[name]];
        case name.indexOf('Edge') > -1:
            return this.enums.edge[this.data[name]];
        case name === 'flexDirection':
        case name === 'flexWrap':
        case name === 'positionType':
        case name === 'overflow':
        case name === 'display':
        case name === 'justifyContent':
            return this.enums[name][this.data[name]];
        default:
            return this.data[name];
        }
    },
    enums: {
        align: {
            count: Yoga.ALIGN_COUNT,
            auto: Yoga.ALIGN_AUTO,
            'flex-start': Yoga.ALIGN_FLEX_START,
            center: Yoga.ALIGN_CENTER,
            'flex-end': Yoga.ALIGN_FLEX_END,
            stretch: Yoga.ALIGN_STRETCH,
            baseline: Yoga.ALIGN_BASELINE,
            'space-between': Yoga.ALIGN_SPACE_BETWEEN,
            'space-around': Yoga.ALIGN_SPACE_AROUND,
        },
        dimension: {
            count: Yoga.DIMENSION_COUNT,
            width: Yoga.DIMENSION_WIDTH,
            height: Yoga.DIMENSION_HEIGHT,
        },
        direction: {
            count: Yoga.DIRECTION_COUNT,
            inherit: Yoga.DIRECTION_INHERIT,
            ltr: Yoga.DIRECTION_LTR,
            rtl: Yoga.DIRECTION_RTL,
        },
        display: {
            count: Yoga.DISPLAY_COUNT,
            flex: Yoga.DISPLAY_FLEX,
            none: Yoga.DISPLAY_NONE,
        },
        edge: {
            count: Yoga.EDGE_COUNT,
            left: Yoga.EDGE_LEFT,
            top: Yoga.EDGE_TOP,
            right: Yoga.EDGE_RIGHT,
            bottom: Yoga.EDGE_BOTTOM,
            start: Yoga.EDGE_START,
            end: Yoga.EDGE_END,
            horizontal: Yoga.EDGE_HORIZONTAL,
            vertical: Yoga.EDGE_VERTICAL,
            all: Yoga.EDGE_ALL,
        },
        experimental: {
            count: Yoga.EXPERIMENTAL_FEATURE_COUNT,
            'flex-basis': Yoga.EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS,
        },
        flexDirection: {
            count: Yoga.FLEX_DIRECTION_COUNT,
            column: Yoga.FLEX_DIRECTION_COLUMN,
            'column-reverse': Yoga.FLEX_DIRECTION_COLUMN_REVERSE,
            row: Yoga.FLEX_DIRECTION_ROW,
            reverse: Yoga.FLEX_DIRECTION_ROW_REVERSE,
        },
        justifyContent: {
            count: Yoga.JUSTIFY_COUNT,
            start: Yoga.JUSTIFY_FLEX_START,
            center: Yoga.JUSTIFY_CENTER,
            end: Yoga.JUSTIFY_FLEX_END,
            between: Yoga.JUSTIFY_SPACE_BETWEEN,
            around: Yoga.JUSTIFY_SPACE_AROUND,
            evenly: Yoga.JUSTIFY_SPACE_EVENLY,
        },
        logLevel: {
            count: Yoga.LOG_LEVEL_COUNT,
            error: Yoga.LOG_LEVEL_ERROR,
            warn: Yoga.LOG_LEVEL_WARN,
            info: Yoga.LOG_LEVEL_INFO,
            debug: Yoga.LOG_LEVEL_DEBUG,
            verbose: Yoga.LOG_LEVEL_VERBOSE,
            fatal: Yoga.LOG_LEVEL_FATAL,
        },
        measureMode: {
            count: Yoga.MEASURE_MODE_COUNT,
            undefined: Yoga.MEASURE_MODE_UNDEFINED,
            exactly: Yoga.MEASURE_MODE_EXACTLY,
            'at-most': Yoga.MEASURE_MODE_AT_MOST,
        },
        nodeType: {
            count: Yoga.NODE_TYPE_COUNT,
            default: Yoga.NODE_TYPE_DEFAULT,
            text: Yoga.NODE_TYPE_TEXT,
        },
        overflow: {
            count: Yoga.OVERFLOW_COUNT,
            visible: Yoga.OVERFLOW_VISIBLE,
            hidden: Yoga.OVERFLOW_HIDDEN,
            scroll: Yoga.OVERFLOW_SCROLL,
        },
        positionType: {
            count: Yoga.POSITION_TYPE_COUNT,
            relative: Yoga.POSITION_TYPE_RELATIVE,
            absolute: Yoga.POSITION_TYPE_ABSOLUTE,
        },
        printOptions: {
            count: Yoga.PRINT_OPTIONS_COUNT,
            layout: Yoga.PRINT_OPTIONS_LAYOUT,
            style: Yoga.PRINT_OPTIONS_STYLE,
            children: Yoga.PRINT_OPTIONS_CHILDREN,
        },
        unit: {
            count: Yoga.UNIT_COUNT,
            undefined: Yoga.UNIT_UNDEFINED,
            point: Yoga.UNIT_POINT,
            percent: Yoga.UNIT_PERCENT,
            auto: Yoga.UNIT_AUTO,
        },
        flexWrap: {
            count: Yoga.WRAP_COUNT,
            'no-wrap': Yoga.WRAP_NO_WRAP,
            wrap: Yoga.WRAP_WRAP,
            'wrap-reverse': Yoga.WRAP_WRAP_REVERSE,
        },
    },
});
