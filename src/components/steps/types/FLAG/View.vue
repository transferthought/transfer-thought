<template>
    <v-container id="flag" align="center" justify="center" class="fill-height pa-5 d-flex align-end pointer-events-none">
        <v-btn
            class="tt-text dark-background text-capitalize font-weight-bold pointer-events-auto"
            block
            shaped
            depressed
            x-large
            color="primary"
            @click="handleSubmit"
        >
            {{ step.data.confirmationButton || 'Submit' }}
        </v-btn>
    </v-container>
</template>
<script>
import _ from 'lodash';

import StepViewerMixin from '../../mixins/StepViewMixin';

const flagSrcs = {
    green:
        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/d0ecc725-1b41-4aeb-9e45-f060ed034434.315ac0b0-be01-4dd1-8a4a-60e72760a099',
    red:
        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/66473bcc-7604-4791-898c-fecb10f7610d.0af682df-2e6c-4066-9866-b810a245bbca',
};

export default {
    name: 'FlagViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            response: null,
            selectedResponse: null,
        };
    },
    computed: {
        allowIncorrect() {
            return !!this.$store.state.apps.state.state.allowIncorrect;
        },
        responses() {
            return this.$store.state.apps.state.state.responses;
        },
        currentStepOptions() {
            return this.step.data.options;
        },
        coach() {
            try {
                return this.$store.state.apps.state.state.coach;
            } catch {
                return {};
            }
        },
    },
    mounted() {
        this.unsubscribe = this.$store.subscribeAction(({ type, payload }) => {
            if (type === 'steps/handleHotspotClick') {
                this.handleHotspotClick(payload);
            }
        });
        this.updateFlags();
    },
    beforeDestroy() {
        this.unsubscribe();
        this.removeFlags();
    },
    methods: {
        async handleHotspotClick(payload) {
            const clickedHotspot = _.find(this.currentStepOptions, (option) => {
                return option.id === payload.id;
            });
            if (
                this.responses &&
                this.responses[this.step.id] &&
                this.responses[this.step.id].values &&
                this.responses[this.step.id].values[clickedHotspot.id]
            ) {
                const currentValue = this.responses[this.step.id].values[clickedHotspot.id];
                this.$store.dispatch('steps/updateResponseValue', {
                    stepId: this.step.id,
                    valueId: clickedHotspot.id,
                    value: currentValue === 'green' ? 'red' : 'green',
                });
            } else {
                this.$store.dispatch('steps/updateResponseValue', {
                    stepId: this.step.id,
                    valueId: clickedHotspot.id,
                    value: 'green',
                });
            }
            this.updateFlags();
        },
        updateFlags() {
            // add flags to environment
            console.log('ADD GLAGS', this.responses);
            const currentEntities = _.clone(this.currentEnvironment.data.entities) || {};
            if (this.responses && this.responses[this.step.id] && this.responses[this.step.id].values) {
                const currentStepResponseValues = this.responses[this.step.id].values;
                _(currentStepResponseValues)
                    .keys()
                    .forEach((key) => {
                        const value = currentStepResponseValues[key];
                        const flagId = `${key}_flag`;
                        let flag = currentEntities[flagId];
                        if (flag) {
                            flag.src = flagSrcs[value];
                        } else {
                            const hotspot = _.find(this.currentStepOptions, (option) => {
                                return option.id === key;
                            });
                            const flagPosition = { ...new THREE.Vector3(hotspot.position.x, hotspot.position.y, hotspot.position.z).multiplyScalar(1.05) };
                            flag = this.createFlag(flagId, flagPosition, flagSrcs[value]);
                        }
                        currentEntities[flag.id] = flag;
                    });
            }

            this.$store.dispatch('steps/updateStepDataById', {
                id: this.currentEnvironment.id,
                newData: { entities: _.cloneDeep(currentEntities) },
            });
        },
        createFlag(id, position, src) {
            const flagImage = {
                id,
                tags: '',
                title: 'Image',
                src,
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                position,
                scale: {
                    x: 10,
                    y: 10,
                    z: 10,
                },
                type: 'image',
            };
            return flagImage;
        },
        removeFlags() {
            // add flags to environment
            if (this.responses && this.responses[this.step.id] && this.responses[this.step.id].values) {
                const currentEntities = _.cloneDeep(this.currentEnvironment.data.entities) || {};
                const currentStepResponseValues = this.responses[this.step.id].values;
                _(currentStepResponseValues)
                    .keys()
                    .forEach((key) => {
                        const flagId = `${key}_flag`;
                        delete currentEntities[flagId];
                    });

                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.currentEnvironment.id,
                    newData: { entities: currentEntities },
                });
            }
        },
        handleSubmit() {
            this.$emit('complete');
        },
    },
};
</script>

<style scoped></style>
