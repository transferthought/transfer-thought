<template>
    <v-menu
        :close-on-content-click="false"
        transition="scale-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                absolute
                right
                top
                max-width="30"
                min-width="30"
                height="28"
                color="white"
                depressed
                v-bind="attrs"
                class="font-weight-600 text-capitalize btn-neutral pa-1 rounded-sm"
                @click.prevent="on.click"
            >
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(menuItem, index) in menuItems"
                :key="index"
                @click="menuItem.action"
            >
                <v-list-item-icon>
                    <v-icon :class="menuItem.class">
                        {{ menuItem.icon }}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content :class="menuItem.class">
                    {{ menuItem.display }}
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import _ from 'lodash';
import RoutingMixin from '@/mixins/RoutingMixin';

export default {
    components: {
    },
    mixins: [RoutingMixin],
    props: {
        course: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            menuItems: [
                {
                    icon: 'mdi-pencil',
                    class: '',
                    display: 'Edit',
                    action: _.bind(this.to, this, 'AdminCourseSections', { courseId: this.course.id }, false),
                },
                {
                    icon: 'mdi-eye',
                    class: '',
                    display: 'Preview',
                    action: _.bind(this.to, this, 'StudentCourse', { courseId: this.course.id }, true),
                },
                {
                    icon: 'mdi-delete',
                    class: 'error--text text--darken-2',
                    display: 'Delete',
                    action: _.bind(this.$store.dispatch, this, 'courses/deleteCourse', this.course.id),
                },
            ],
        };
    },
    computed: {
    },
    methods: {
    },
};
</script>
