<template>
    <div class="d-flex flex-row" style="flex: 1 1">
        <div>
            <v-text-field
                :id="id"
                v-show="edit"
                ref="value"
                v-model="temporaryValue"
                transition="scale-transition"
                outlined
                dense
                hide-details
                class="input-style font-size-input"
                @keypress.enter="acceptChanges"
                @keypress.esc="discardChanges"
                @blur="acceptChanges"
                @click.stop
                @mousedown.stop
            />
            <div v-show="!edit">
                <slot name="Display" :value="value" :edit="enableEdit">
                    <div style="cursor: pointer" @click.stop="enableEdit()">
                        {{ value }}
                    </div>
                </slot>
            </div>
        </div>
        <!-- <div class="pl-2">
            <v-btn
                v-show="edit"
                icon
                @click="discardChanges()"
            >
                <v-icon color="error">
                    mdi-close-circle-outline
                </v-icon>
            </v-btn>
            <v-btn
                v-show="edit"
                fab
                icon
                @click="acceptChanges()"
            >
                <v-icon color="success">
                    mdi-check
                </v-icon>
            </v-btn>
        </div> -->
    </div>
</template>

<script>
export default {
    props: ['id', 'value'],

    data() {
        return {
            edit: false,
            temporaryValue: this.value,
        };
    },

    watch: {
        value() {
            this.temporaryValue = this.value;
        },
    },

    methods: {
        enableEdit() {
            this.edit = true;
            this.$nextTick(() => {
                const inputEl = this.$refs.value.$el.querySelector('input');
                inputEl.select();
            });
        },
        acceptChanges() {
            this.$emit('change', this.temporaryValue);
            this.edit = false;
        },
        discardChanges() {
            this.temporaryValue = this.value;
            this.edit = false;
        },
    },
};
</script>
