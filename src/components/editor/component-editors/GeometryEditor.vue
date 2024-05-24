<template>
    <div>
        <v-autocomplete
            v-model="primitive"
            :items="primitiveTypes"
            dense
        />
        <div
            v-for="primitiveProperty in primitiveProperties"
            :key="primitiveProperty.name"
        >
            <component
                :is="primitiveProperty.controller"
                :input-definition="primitiveProperty"
                :current-value="getCurrentValueForAttribute(primitiveProperty.name)"
                :on-value-changed="handleAttributeValueChanged"
            />
        </div>
    </div>
</template>

<script>
import Primitives, { PrimitiveList } from './GeometryPrimitives';
import BaseComponentEditor from './BaseComponentEditor.vue';

export default {
    name: 'GeometryEditor',
    extends: BaseComponentEditor,
    data() {
        const primitive = this.attributes.primitive || 'box';
        return {
            primitive,
            primitiveTypes: PrimitiveList,
        };
    },
    computed: {
        primitiveProperties() {
            const primitive = Primitives[this.primitive];
            return primitive ? primitive.properties : [];
        },
    },
    watch: {
        primitive() {
            const newAttributes = {
                primitive: this.primitive,
            };
            this.primitiveProperties.forEach((primitiveProperty) => {
                newAttributes[primitiveProperty.name] = this.getCurrentValueForAttribute(primitiveProperty.name) || primitiveProperty.default;
            });
            this.onAttributesUpdated(newAttributes, true);
        },
    },
};
</script>
