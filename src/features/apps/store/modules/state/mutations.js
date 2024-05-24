/* eslint-disable no-param-reassign */

import _ from 'lodash';

import { reactive } from '@vue/reactivity';

export default {
    init(state, initialState = {}) {
        state.state = reactive(_.cloneDeep(initialState));
    },

    cache(state) {
        state.cachedState = _.cloneDeep(state.state);
    },

    reset(state) {
        state.state = _.cloneDeep(state.cachedState);
        state.cachedState = null;
    },

    update(state, payload) {
        const { selector, value } = payload;
        _.set(state.state, selector, value);
    },

    get(state, payload) {
        const { selector, defaultValue } = payload;
        return _.get(state, selector, defaultValue);
    },

    set(selector, filter, value) {
        const currentValue = this.get(selector);
        if (_.isUndefined(value)) {
            value = filter;
            _.set(this.state, selector, value);
        } else if (_.isArray(currentValue)) {
            const itemIndex = _.findIndex(currentValue, filter);
            if (itemIndex > -1) {
                currentValue.splice(itemIndex, 1, value);
            }
        }
    },

    remove(state, payload) {
        const { selector, filter } = payload;
        const currentValue = _.get(state.state, selector, []);
        let newValue = currentValue;
        if (_.isArray(currentValue) && _.isObject(filter)) {
            newValue = _.filter(currentValue, filter);
        } else if (_.isArray(currentValue)) {
            newValue = _.filter(currentValue, (item) => item === filter);
        } else if (_.isObject(currentValue)) {
            newValue = _.omit(currentValue, filter);
        }
        _.set(state.state, selector, newValue);
    },

    increment(selector, value) {
        const currentValue = this.get(selector, 0);
        if (_.isNumber(currentValue)) {
            this.set(selector, _.add(currentValue, value));
        }
    },
};
