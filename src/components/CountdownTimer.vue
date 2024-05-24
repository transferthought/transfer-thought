<template>
    <div>
        <div @click="toggleEdit">
            <v-progress-circular
                v-if="!editTime"
                :value="percentTime"
                color="red"
                :indeterminate="outOfTime"
            >
                {{ parseInt(displayTime / 60000) }}
            </v-progress-circular>
            <v-text-field
                v-if="editTime"
                v-model="newTime"
                autofocus
                placeholder="5"
                @keyup.enter="setTime"
                @blur="toggleEdit"
            />
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'CountdownTimer',
    props: {
        timerData: Object,
    },
    data() {
        return {
            displayTime: 0,
            startingTime: 5,
            timeLeft: 5,
            outOfTime: false,
            editTime: false,
            newTime: 5,
            percentTime: 0,
            interval: {},
        };
    },
    methods: {
        toggleEdit() {
            this.editTime = !this.editTime;
            if (this.editTime) {
                this.timerData.active = false;
                this.outOfTime = false;
                this.$emit('timer-updated');
            }
        },
        setTime() {            
            this.timerData.duration = this.newTime;
            this.timerData.startTime = new Date();
            this.timerData.active = true;
            this.$emit('timer-updated');
            //this.stopTimer();
            //this.startTimer();
        },
        startTimer() {
            this.$nextTick(() => {
                if(true){
                    this.interval = setInterval(function () {
                        if(!this.timerData.active){
                            this.outOfTime = false
                            return;
                        }
                        this.displayTime = new Date(this.timerData.startTime).getTime() + this.timerData.duration * 60000 - new Date().getTime();
                        this.percentTime = 100 - ((this.displayTime / (this.timerData.duration * 60000)) * 100);

                        if (this.displayTime <= 0) {
                            this.outOfTime = true;
                            this.displayTime = 0;
                        }
                        else if(this.displayTime > 0)
                        {
                            this.outOfTime = false;
                        }
                        /*
                        const delta = 1;
                        this.timeLeft -= delta;
                        if(!this.editTime) {
                            this.newTime = this.timeLeft;
                        }
                        this.percentTime = 100 - ((this.timeLeft / this.startingTime) * 100);
                        if(this.timeLeft === 0){
                            this.outOfTime = true;
                            this.$emit('finish');
                        }
                        if(this.timeLeft <= 0 && !this.showNegatives){
                            this.timeLeft = 0;
                            clearInterval(this.interval);
                        }
                        */
                    }.bind(this), 1000);
                }
            });
        },
        stopTimer() {
            clearInterval(this.interval);
        }
    },
    mounted() {
        this.startTimer();
    },
};

</script>
