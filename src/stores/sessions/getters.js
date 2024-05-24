/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export const getSessionById = (state) => (sessionId) => state.byId[sessionId];
export const getCurrentSessionIdForUser = (state) => () => _.find(state.allIds, (sessionId) => {
    const session = state.byId[sessionId];
    return session.completedAt === null;
});
