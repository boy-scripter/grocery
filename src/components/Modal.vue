<template>
    <div class="modal-backdrop" @click="close">
        <div class="modal" @click.stop>
            <div class="btn-cont">
                <button type="button" class="btn" @click="close">
                    <i class="fa-regular fa-circle-xmark"></i>
                </button>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script setup>

import { defineEmits } from 'vue';

const emit = defineEmits(['close'])

function close() {
    emit('close')
}

</script>

<style scoped>
.modal-backdrop {
    background: rgba(142, 138, 138, 0.768);

    /* background: red; */
    top: 0;
    left: 0;
    position: fixed;
    z-index: 111;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    padding: 15px;
    border-radius: 25px;
    background-color: rgb(175, 199, 239);
    min-width: 50%;
    max-width: 65%;
    min-height: 50%;
    max-height: 90vh;
    overflow: scroll;
    transition: 0.3s linear;
}

.btn {
    padding: 5px 10px 2px 10px;
}

.btn-cont {

    text-align: right;
}

i {
    color: white;
    font-size: 24px;
}

@media only screen and (max-width: 600px) {
    .modal {
        min-width: 90%;
        width: 90%;
        min-height: 60%;
    }
}
</style>