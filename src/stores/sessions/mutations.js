import _ from 'lodash';

function parseSession(session) {
    // eslint-disable-next-line no-param-reassign
    session.data = JSON.parse(session.data);
}

export default {
    resetSessions(state, sessions) {
        _.forEach(sessions, parseSession);
        state.byId = _.keyBy(sessions, 'id');
        state.allIds = _.map(sessions, 'id');
    },
    addSession(state, session) {
        parseSession(session);
        state.byId[session.id] = session;
        state.allIds.push(session.id);
    },
    updateSession(state, session) {
        parseSession(session);
        state.byId[session.id] = session;
    },
    removeSession(state, session) {
        const index = _.findIndex(state.list, { id: session.id });
        state.allIds.splice(index, 1);
        delete state.byId[session.id];
    },
};
