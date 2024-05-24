import _ from 'lodash';

export default {
    update(state, payload) {
        const { selector, value } = payload;
        _.set(state, selector, value);
    },
};
