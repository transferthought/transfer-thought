<template>
    <div>
        <!-- Use the component in the right place of the template -->
        <tiptap-vuetify v-model="content" :extensions="extensions" :card-props="{ outlined: true }" />
    </div>
</template>

<script>
// import the component and the necessary extensions
import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History,
} from 'tiptap-vuetify';

export default {
    // specify TiptapVuetify component in "components"
    components: { TiptapVuetify },
    props: {
        value: String,
    },
    data: () => ({
        // declare extensions you want to use
        extensions: [
            Blockquote,
            Link,
            ListItem,
            BulletList,
            OrderedList,
            [
                Heading,
                {
                    options: {
                        levels: [1, 2, 3],
                    },
                },
            ],
            Bold,
            HorizontalRule,
            HardBreak,
        ],
    }),
    computed: {
        content: {
            get() {
                return this.value;
            },
            set(newContent) {
                this.$emit('change', newContent);
            },
        },
    },
};
</script>

<style>
.tiptap-vuetify-editor .ProseMirror {
    min-height: 100px;
}
</style>
