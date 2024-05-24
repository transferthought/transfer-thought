import _ from 'lodash';

export default {
    setUser(state, { authUser, userData }) {
        state.authorized = !!authUser && authUser.attributes && authUser.attributes.email_verified;
        state.user = authUser;
        state.data = userData;
    },
    updateUserData(state, { key, value }) {
        state.data[key] = value;
    },
    updateUserPlan(state, plan) {
        state.data.plan = plan;
    },
};
