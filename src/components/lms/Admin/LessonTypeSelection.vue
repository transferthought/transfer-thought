<template>
    <v-menu
        v-model="opened"
        :close-on-content-click="false"
        offset-y
        transition="scale-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                depressed
                v-bind="attrs"
                class="font-weight-600 text-capitalize py-1 px-2 mx-3"
                v-on="on"
            >
                Add Lesson
            </v-btn>
        </template>

        <v-card width="400">
            <v-card-text>
                <h2> Basic Lesson Types </h2>
                <v-row>
                    <v-col
                        v-for="lessonType in basicLessonTypes"
                        :key="lessonType.value"
                        cols="3"
                    >
                        <v-badge
                            bordered
                            :value="!lessonType.enabled"
                            color="primary"
                            icon="mdi-lock"
                            overlap
                        >
                            <v-btn
                                depressed
                                :disabled="!lessonType.enabled"
                                x-large
                                max-width="80"
                                min-width="80"
                                class="text-caption text-lowercase"
                                @click="handleLessonSelected(lessonType.value)"
                            >
                                <v-row no-gutters>
                                    <v-col cols="12">
                                        <v-icon>{{ lessonType.icon }}</v-icon>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        class="mt-1"
                                    >
                                        <span>{{ lessonType.display }}</span>
                                    </v-col>
                                </v-row>
                            </v-btn>
                        </v-badge>
                    </v-col>
                </v-row>
                <h2> Advanced Lesson Types </h2>
                <v-row>
                    <v-col
                        v-for="lessonType in advancedLessonTypes"
                        :key="lessonType.value"
                        cols="3"
                    >
                        <v-badge
                            bordered
                            :value="!lessonType.enabled"
                            color="primary"
                            icon="mdi-lock"
                            overlap
                        >
                            <v-btn
                                depressed
                                :disabled="!lessonType.enabled"
                                x-large
                                max-width="80"
                                min-width="80"
                                class="text-caption text-lowercase"
                                @click="handleLessonSelected(lessonType.value)"
                            >
                                <v-row no-gutters>
                                    <v-col cols="12">
                                        <v-icon>{{ lessonType.icon }}</v-icon>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        class="mt-1"
                                    >
                                        <span>{{ lessonType.display }}</span>
                                    </v-col>
                                </v-row>
                            </v-btn>
                        </v-badge>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn
                    text
                    class="body-2 font-weight-bold text-capitalize"
                    @click="handleCancelClicked"
                >
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
import _ from 'lodash';

export default {
    data() {
        return {
            opened: false,
        };
    },
    computed: {
        lessonTypes() {
            return this.$store.state.courses.lessonTypes;
        },
        basicLessonTypes() {
            return _(this.lessonTypes).filter({ type: 'basic' }).value();
        },
        advancedLessonTypes() {
            return _(this.lessonTypes).filter({ type: 'advanced' }).value();
        },
    },
    methods: {
        close() {
            this.opened = false;
        },
        handleLessonSelected(lessonType) {
            this.$emit('lesson-type-selected', lessonType);
            this.close();
        },
        handleCancelClicked() {
            this.close();
        },
    },
};
</script>
