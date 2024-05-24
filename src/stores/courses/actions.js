/* eslint-disable import/prefer-default-export */
import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as UUID from 'uuid/v4';

const DEFAULT_SECTION = {
    title: 'New Section',
    lessons: [],
};

const DEFAULT_LESSON = {
    title: 'New Lesson',
    type: 'text',
};

function parseCourse(course) {
    // eslint-disable-next-line no-param-reassign
    course.sections = JSON.parse(course.sections);
    return course;
}

// COURSE LIST ACTIONS
export const fetchCourses = async ({ commit, state, rootState }) => {
    if (state.list.length === 0) {
        const {
            data: { ownerCoursesByTitle: courseList },
        } = await Client.Api.query({
            query: gql(Client.Queries.ownerCoursesByTitle),
            variables: { owner: rootState.user.user.username },
            fetchPolicy: 'no-cache',
        });
        _.forEach(courseList.items, (course) => {
            parseCourse(course);
        });
        commit('setCourses', courseList.items);
    }
};

export const fetchCourse = async ({ commit, state }, payload) => {
    const { courseId } = payload;
    // first check local cache and then check DB
    const localCourse = _.find(state.list, { id: courseId });
    if (!localCourse) {
        const {
            data: { getCourse: course },
        } = await Client.Api.query({
            query: gql(Client.Queries.getCourse),
            variables: { id: courseId },
            fetchPolicy: 'no-cache',
        });
        parseCourse(course);
        commit('addNewCourse', course);
        return course;
    }
    return localCourse;
};

export const createCourse = async ({ commit }, courseData = {}) => {
    const newCourse = _.defaults(courseData, {
        id: UUID(),
        title: 'New Course',
        description: 'New Course Description',
        sections: JSON.stringify([
            {
                title: 'Section 1',
                lessons: [],
            },
        ]),
        updatedAt: new Date(),
        createdAt: new Date(),
    });

    const {
        data: { createCourse: course },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createCourse),
        variables: {
            input: newCourse,
        },
    });
    parseCourse(course);
    commit('addNewCourse', course);
    return course;
};

// COURSE ACTIONS

export const deleteCourse = async ({ commit }, courseId) => {
    await Client.Api.mutate({
        mutation: gql(Client.Mutations.deleteCourse),
        variables: {
            input: {
                id: courseId,
            },
        },
    });
    commit('removeCourse', courseId);
};
export const saveCourse = _.debounce(({ getters }, courseId) => {
    // this can be debounced
    // save course to DB
    const course = getters.getCourseById(courseId);
    Client.Api.mutate({
        mutation: gql(Client.Mutations.updateCourse),
        variables: {
            input: {
                id: course.id,
                title: course.title,
                description: course.description,
                thumbnailUrl: course.thumbnailUrl,
                sections: JSON.stringify(course.sections),
                updatedAt: new Date(),
            },
        },
    });
}, 1000);

export const updateCourseProp = async ({ getters, dispatch }, payload) => {
    const { courseId, key, value } = payload;
    const course = getters.getCourseById(courseId);
    _.set(course, key, value);
    dispatch('saveCourse', courseId);
};

export const addSection = async ({ getters, dispatch }, payload) => {
    const { courseId } = payload;
    const course = getters.getCourseById(courseId);

    course.sections.push(_.cloneDeep(DEFAULT_SECTION));
    dispatch('saveCourse', courseId);
};

export const deleteSection = async ({ getters, dispatch }, payload) => {
    const { courseId, sectionIndex } = payload;
    const course = getters.getCourseById(courseId);
    const section = course.sections[sectionIndex];
    if (section) {
        course.sections.splice(sectionIndex, 1);
        dispatch('saveCourse', courseId);
    }
};

export const updateSectionTitle = async ({ getters, dispatch }, payload) => {
    const { courseId, sectionIndex, newTitle } = payload;
    const course = getters.getCourseById(courseId);
    const section = course.sections[sectionIndex];
    if (section) {
        section.title = newTitle;
        dispatch('saveCourse', courseId);
    }
};

export const addLesson = async ({ getters, dispatch }, payload) => {
    const { courseId, sectionIndex, partial } = payload;
    const course = getters.getCourseById(courseId);
    const section = course.sections[sectionIndex];
    if (section) {
        const lesson = _.defaults({}, partial, DEFAULT_LESSON);
        const newAppData = await getters.getNewLessonAppByType(lesson.type);
        const app = await dispatch('apps/createApp', newAppData, { root: true });
        lesson.appId = app.appId;
        section.lessons.push(lesson);
        dispatch('saveCourse', courseId);
        return lesson;
    }
};

export const importLesson = async ({ getters, dispatch }, payload) => {
    const { courseId, sectionIndex, lessonId } = payload;
    const course = getters.getCourseById(courseId);
    const section = course.sections[sectionIndex];
    if (section) {
        const lessonToClone = getters.getCourseLessonById(courseId, lessonId);
        if (lessonToClone) {
            const lesson = _.defaults({}, lessonToClone, DEFAULT_LESSON);
            const app = await dispatch('apps/cloneApp', { appId: lessonToClone.appId }, { root: true });
            lesson.appId = app.appId;
            section.lessons.push(lesson);
            dispatch('saveCourse', courseId);
        }
    }
};

export const deleteLesson = async ({ getters, dispatch }, payload) => {
    const { courseId, sectionIndex, lessonIndex } = payload;
    const course = getters.getCourseById(courseId);
    const section = course.sections[sectionIndex];
    if (section) {
        const lesson = section.lessons[lessonIndex];
        if (lesson) {
            await dispatch('apps/deleteApp', { appId: lesson.appId, type: 'master' }, { root: true });
            section.lessons.splice(lessonIndex, 1);
            dispatch('saveCourse', courseId);
        }
    }
};

export const updateLessonTitle = async ({ getters, dispatch }, payload) => {
    const { courseId, sectionIndex, lessonIndex, newTitle } = payload;
    const course = getters.getCourseById(courseId);
    const section = course.sections[sectionIndex];
    if (section) {
        const lesson = section.lessons[lessonIndex];
        if (lesson) {
            dispatch('updateLessonTitleById', { courseId, lessonId: lesson.id, newTitle });
        }
    }
};

export const updateLessonTitleById = async ({ getters, dispatch, commit }, payload) => {
    const { courseId, lessonId, newTitle } = payload;
    const lesson = getters.getCourseLessonById(courseId, lessonId);
    if (lesson) {
        lesson.title = newTitle;

        commit('apps/updateName', newTitle, { root: true });
        dispatch('saveCourse', courseId);
    }
};
