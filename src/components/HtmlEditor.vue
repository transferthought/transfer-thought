<template>
    <div class="quill">
        <div
            v-if="readOnly"
            class="ql-editor"
            v-html="value"
        />
        <div
            v-else
        >
            <div
                :id="toolbarId"
            >
                <div class="ql-formats">
                    <select class="ql-size">
                        <option value="small" />
                        <!-- Note a missing, thus falsy value, is used to reset to default -->
                        <option selected />
                        <option value="large" />
                        <option value="huge" />
                    </select>
                    <select class="ql-align">
                        <option selected />
                        <option value="center" />
                        <option value="right" />
                        <option value="justify" />
                    </select>
                    <button class="ql-bold" />
                    <button class="ql-italic" />
                    <button class="ql-underline" />
                    <button class="ql-blockquote" />
                    <button class="ql-italic" />
                    <button class="ql-image" />
                    <button
                        type="button"
                        class="ql-list"
                        value="ordered"
                    />
                    <button
                        type="button"
                        class="ql-list"
                        value="bullet"
                    />
                </div>
            </div>
            <div
                :id="editorId"
                ref="editor"
                :name="name"
            />
        </div>
    </div>
</template>
<script>
import 'quill/dist/quill.snow.css';

export default {
    name: 'HtmlEditor',
    props: {
        value: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            editor: null,
            content: null,
            lastHtmlValue: '',
            editorId: null,
            toolbarId: null,
        };
    },
    watch: {
        value(newVal) {
            if (newVal !== this.content) {
                this.pasteHTML(newVal);
            }
        },
    },
    async mounted() {
        if (!this.readOnly) {
            let Quill = await import('quill');
            Quill = Quill.default || Quill;
            this.editorId = this.randomString();
            this.toolbarId = this.randomString();
            this.$nextTick(() => {
                this.initialize(Quill);
            });
        }
    },
    methods: {
        initialize(Quill) {
            this.editor = new Quill(`#${this.editorId}`, {
                theme: 'snow',
                modules: {
                    toolbar: `#${this.toolbarId}`,
                },
            });
            if (this.value.length > 0) {
                this.editor.pasteHTML(this.value);
            }
            const editorRef = this.$refs.editor;
            const node = editorRef.children[0];
            this.editor.on('text-change', () => {
                let html = node.innerHTML;
                if (html === '<p><br></p>') {
                    html = '';
                }
                this.content = html;
                this.$emit('input', this.content);
            });
        },
        pasteHTML() {
            if (!this.editor) {
                return;
            }
            this.editor.pasteHTML(this.value);
        },
        randomString() {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            for (let i = 0; i < 5; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },
    },
};
</script>
<style scoped>
.ql-container {
  min-height: 300px;
}
</style>
