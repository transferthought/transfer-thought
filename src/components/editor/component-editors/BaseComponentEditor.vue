<script>
import _ from 'lodash';

export default {
    name: 'BaseComponentEditor',
    props: {
        entityId: String,
        attributes: [Object, Boolean, String],
        componentDefinition: Object,
        onAttributesUpdated: {
            type: Function,
            default: () => {},
        },
    },
    methods: {
        handleAttributeValueChanged(property, newValue) {
            if (_.isObject(this.attributes)) {
                this.onAttributesUpdated({ [property]: newValue });
            } else {
                this.onAttributesUpdated(newValue);
            }
        },
        getCurrentValueForAttribute(property) {
            if (_.isObject(this.attributes)) {
                return this.attributes[property];
            }
            return this.attributes;
        },
    },
};
</script>
