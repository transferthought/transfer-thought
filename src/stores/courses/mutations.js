import { _ } from 'core-js';

export default {
    setCourses(state, courses) {
        state.list = courses;
    },
    addNewCourse(state, course) {
        state.list.unshift(course);
    },
    removeCourse(state, courseId) {
        const index = _.findIndex(state.list, { id: courseId });
        state.list.splice(index, 1);
    },
};
