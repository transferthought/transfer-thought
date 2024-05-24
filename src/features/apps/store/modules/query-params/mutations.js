import _ from 'lodash';

export default {
    init(state) {
        const { query } = window.TT.router.currentRoute;
        _.forEach(query, (value, key) => {
            state[key] = value;
        });
    },
    update(state, payload) {
        const { selector, value } = payload;
        _.set(state.state, selector, value);
    },
};
