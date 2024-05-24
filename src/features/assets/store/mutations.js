import state from './state';

export default {
    addUploadingItem(state, item) {
        state.uploading = [item, ...state.uploading];
    },
    updateUploadingItem(state, newItem) {
        state.uploading = state.uploading.map((currentItem) => {
            if (newItem.id === currentItem.id) {
                return newItem;
            }
            return currentItem;
        });
    },
    removeUploadingItem(state, item) {
        state.uploading = state.uploading.filter((currentItem) => {
            return currentItem.id === item.id;
        });
    },
    setCurrentParentId(state, currentParentId) {
        state.currentParentId = currentParentId;
    },
};
