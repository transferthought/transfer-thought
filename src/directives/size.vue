<script>
/* eslint-disable no-param-reassign */

const Size = {
    bind(el, binding) {
        const { value: { height, width } } = binding;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
    },
    update(el, binding) {
        const { value: { height, width } } = binding;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
    },
};
export default Size;
</script>
