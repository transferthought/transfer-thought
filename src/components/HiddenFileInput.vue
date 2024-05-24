<template>
    <div>
        <input
            ref="fileInput"
            type="file"
            hidden
            :multiple="multiple"
            @change="emitFilesChanged($event.target.files)"
        >
        <slot :openFileSelect="openFileSelect">
            <button @click="openFileSelect">
                Choose
            </button>
        </slot>
    </div>
</template>
<script>
export default {
    name: 'HiddenFileInput',
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['files-changed'],
    methods: {
        openFileSelect() {
            const fileInputElement = this.$refs.fileInput;
            fileInputElement.click();
        },
        emitFilesChanged(files) {
            if (files && files.length) {
                if (this.multiple) {
                    this.$emit('files-changed', files);
                } else {
                    this.$emit('files-changed', files[0]);
                }
            }
        },
    },
};
</script>
<style></style>
