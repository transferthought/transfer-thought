<template>
    <div
        id="video-details"
        class="pa-4"
    >
        <v-container>
            <!-- <div class="d-flex justify-space-between mb-5"> -->
            <v-btn
                text
                small
                class="pl-0"
                @click="$router.go(-1)"
            >
                <v-icon left>
                    mdi-arrow-left
                </v-icon> Channel videos
            </v-btn>
            <h2 class="mt-5">
                Video details
            </h2>
            <v-row>
                <v-col cols="8">
                    <ValidationObserver
                        ref="form"
                        v-slot="{ handleSubmit, reset }"
                    >
                        <form
                            @submit.prevent="handleSubmit(submit)"
                            @reset.prevent="reset"
                        >
                            <ValidationProvider
                                v-slot="{ errors }"
                                name="Title"
                                rules="required|min:3"
                            >
                                <v-text-field
                                    v-model="formData.title"
                                    :error-messages="errors"
                                    label="Title (required)"
                                    class="mb-3"
                                    filled
                                    dense
                                    counter="100"
                                    max-length="100"
                                />
                            </ValidationProvider>
                            <ValidationProvider
                                v-slot="{ errors }"
                                name="Description"
                                rules="required|min:3"
                            >
                                <v-textarea
                                    v-model="formData.description"
                                    filled
                                    auto-grow
                                    :error-messages="errors"
                                    label="Description"
                                    placeholder="Tell viewers about your video"
                                    rows="5"
                                    counter="5000"
                                    max-length="5000"
                                    row-height="20"
                                />
                            </ValidationProvider>
                            <ValidationProvider
                                v-slot="{ errors }"
                                name="Visibilty"
                                rules="required|min:3"
                            >
                                <v-select
                                    v-model="formData.visibilty"
                                    :items="visibilty"
                                    :error-messages="errors"
                                    filled
                                    label="Visibilty"
                                />
                            </ValidationProvider>
                            <ValidationProvider
                                v-slot="{ errors }"
                                name="Cateogry"
                                rules="required|min:3"
                            >
                                <v-select
                                    v-model="formData.category"
                                    :items="categories"
                                    :error-messages="errors"
                                    filled
                                    label="Categories"
                                />
                            </ValidationProvider>

                            <div class="mt-6 d-flex justify-space-between">
                                <v-btn
                                    type="submit"
                                    class="primary"
                                    depressed
                                >
                                    Submit
                                </v-btn>
                            </div>
                        </form>
                    </ValidationObserver>
                </v-col>
                <v-col
                    cols="4"
                    class="text-center"
                >
                    <v-btn
                        text
                        @click="toggleShow"
                    >
                        Upload Thumbnails
                    </v-btn>
                    <my-upload
                        v-model="show"
                        field="img"
                        :width="400"
                        :height="400"
                        :params="params"
                        :headers="headers"
                        img-format="jpg"
                        lang-type="en"
                        @crop-success="cropSuccess"
                    />
                    <v-responsive style="max-width: 100%">
                        <div
                            v-if="!imgDataUrl"
                            id="image-placeholder"
                            class="px-12"
                        >
                            <v-icon>mdi-image-plus</v-icon>
                        </div>
                        <v-img
                            v-else
                            height="350"
                            :src="imgDataUrl"
                        />
                    </v-responsive>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'Details',
    components: {

    },
    data() {
        return {
            // dialog: this.openDialog ? this.openDialog : false,
            valid: false,
            uploaded: false,
            uploading: false,
            interval: {},
            value: 0,
            show: false,
            rules: [
                (value) => !value
          || value.size < 5000000
          || 'Video size should be less than 5 MB!',
            ],
            categories: ['People', 'Technology', 'Fashion'],
            visibilty: ['Public', 'Private'],
            formData: {
                title: '',
                description: '',
                category: '',
                visibilty: '',
            },
            imgDataUrl: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
            params: {
                token: '123456798',
                name: 'avatar',
            },
            headers: {
                smail: '*_~',
            },
        };
    },
    mounted() {},
    methods: {
        submit() {
            console.log('submittied');
            this.closeModal();
        },
        toggleShow() {
            this.show = !this.show;
        },
        cropSuccess(imgDataUrl, field) {
            console.log('-------- crop success --------');
            console.log(field);
            this.imgDataUrl = imgDataUrl;
        },
    },
};
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
