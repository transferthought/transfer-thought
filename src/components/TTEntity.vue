<script>
import { mapState } from 'vuex';
import _ from 'lodash';
// import { VBtn } from 'vuetify/lib';
import Components from '@/components/editor/component-editors/ComponentDefinitions';
import TTButton from '@/components/TTButton.vue';
import TTPanel from '@/components/TTPanel.vue';
import TTCheckbox from '@/components/TTCheckbox.vue';

const COMPONENT_MAP = {
    TTButton,
    TTPanel,
    TTCheckbox,
};

export default {
    name: 'TTEntity',
    props: {
        entityId: String,
    },
    computed: {
        ...mapState({
            config: (state) => state.apps.config.config,
        }),
        directives() {
            return _(this.config)
                .filter((item) => item.entityId === this.entityId && item.type === 'component' && item.componentType !== 'render-tag')
                .map((item) => ({
                    name: this.getComponentType(item.componentType),
                    value: item.attributes,
                }))
                .value();
        },
    },
    methods: {
        getComponentType(requestedComponentType) {
            // Check if this component has an ECSON defintion
            // If it does return mapped HTML component, otherwise take it at face value to support undefined parsed components
            if (Components[requestedComponentType] && Components[requestedComponentType].htmlComponentType) {
                return Components[requestedComponentType].htmlComponentType;
            }
            return requestedComponentType;
        },
    },
    render(createElement) {
        const renderTag = _.find(this.config, (item) => item.entityId === this.entityId && item.type === 'component' && item.componentType === 'render-tag');
        const component = COMPONENT_MAP[renderTag.attributes.value];
        return createElement(component || 'div', {
            attrs: {
                id: this.entityId,
            },
            directives: this.directives,
        });
    },
};
</script>
