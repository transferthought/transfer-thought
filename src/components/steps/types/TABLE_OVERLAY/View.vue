<template>
    <v-container id="table-overlay" align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <v-card class="pointer-events-auto d-flex flex-column fill-height" width="100%" elevation="5">
            <v-toolbar color="primary" class="dark-background tt-text header">
                <v-toolbar-title dark class="tt-text wrap toolbar-title white--text font-weight-600 text-h4 text-capitalize">
                    {{ step.data.title }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="light-background flex-grow-1 flex-shrink-1 fill-height" style="overflow-y:scroll">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left" v-for="field in fields" :key="field.key">
                                    {{ field.display }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="value in values" :key="value.id">
                                <td v-for="field in fields" :key="field.key">{{ value[field.key] }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import _ from 'lodash';
import StepViewerMixin from '../../mixins/StepViewMixin';
import ActionService from '@/services/action-service';

export default {
    name: 'TableViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            fields: [],
            values: [],
        };
    },
    computed: {},
    async mounted() {
        if (this.step.data.getFieldsAction) {
            this.fields = await ActionService.runCustomAction({
                code: this.step.data.getFieldsAction,
            });
        }
        if (this.step.data.getValuesAction) {
            this.values = await ActionService.runCustomAction({
                code: this.step.data.getValuesAction,
            });
        }
    },
    destroyed() {},
    methods: {},
};
</script>

<style></style>
