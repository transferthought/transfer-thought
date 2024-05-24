import _ from 'lodash';

export const getCourseById = (state) => (courseId) => _.find(state.list, { id: courseId });
export const getCourseLessonById = (state, getters) => (courseId, lessonId) => {
    const course = getters.getCourseById(courseId);
    let lesson;
    if (course) {
        _.forEach(course.sections, (section) => {
            lesson = _.find(section.lessons, (l) => l.appId === lessonId);
            if (lesson) {
                return false;
            }
            return true;
        });
    }
    return lesson;
};

export const getLessonConfigByType = (state) => (lessonType) => {
    return state.lessonTypes[lessonType]
};

export const getLessonViewerByType = (state, getters) => async (lessonType) => {
    const lessonConfig = getters.getLessonConfigByType(lessonType);
    if (lessonConfig && lessonConfig.viewer) {
        const {default: lessonViewer} = await import(/* webpackChunkName: "Viewer" */ `@/components/lms/Student/Viewers/${lessonConfig.viewer}.vue`);
        return lessonViewer
    }
    const {default: lessonViewer} = await import(/* webpackChunkName: "Viewer" */ `@/components/Scene.vue`);
    return lessonViewer
};

export const getLessonEditorByType = (state, getters) => async (lessonType) => {
    const lessonConfig = getters.getLessonConfigByType(lessonType);
    const {default: lessonEditor} = await import(/* webpackChunkName: "Editor" */ `@/components/lms/Admin/Editors/${lessonConfig.editor}.vue`);
    return lessonEditor;
};

export const getNewLessonAppByType = (state, getters) => async (lessonType) => {
    const lessonConfig = getters.getLessonConfigByType(lessonType);
    const {default: app} = await import(/* webpackChunkName: "App" */ `@/tt-core/scenes/${lessonConfig.app}/app`);
    _.extend(app.state, { lessonType });
    return {
        name: app.name,
        config: JSON.stringify(app.config),
        state: JSON.stringify(app.state),
        actions: JSON.stringify(app.actions),
    };
};
