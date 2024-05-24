<script>
/* eslint-disable no-param-reassign */

const Text = {
    bind(el, binding) {
        const { value } = binding;
        el.innerText = value.value;
    },
    update(el, binding) {
        const { value } = binding;
        el.innerText = value.value;
    },
};
export default Text;
</script>
