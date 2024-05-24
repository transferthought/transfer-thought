import _ from 'lodash';

export default {
    setList: (state, list) => {
        state.entityIds = _.map(list, state.idAttribute);
        state.entitiesById = _.keyBy(list, state.idAttribute);
    },
    setSingle: (state, item) => {
        state.entitiesById = { ...state.entitiesById, [item[state.idAttribute]]: item };
    },
    create: (state, item) => {
        state.entityIds = [item[state.idAttribute], ...state.entityIds];
        state.entitiesById = { ...state.entitiesById, [item[state.idAttribute]]: item };
    },
    destroy: (state, deletedId) => {
        state.entityIds = _.filter(state.entityIds, (id) => {
            return id !== deletedId;
        });
        delete state.entitiesById[deletedId];

        state.entitiesById = { ...state.entitiesById };
    },
    setSingleStatus: (state, status) => {
        state.singleStatus = status;
    },
    setListStatus: (state, status) => {
        state.listStatus = status;
    },
    setSubscriptionStatus: (state, status) => {
        state.subscriptionStatus = status;
    },
};
