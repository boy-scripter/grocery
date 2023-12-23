<template>
    <div class="box">

        <h1>Signup</h1>
        <div class="login-page">
            <div class="form">
                <form class="login-form" @submit.prevent="signup">
                    <Modal v-if="modal.buyer_or_seller" @close="modal.buyer_or_seller = false">
                        <div class="options_buyer_seller">
                            <button type="submit" @click="state.form.type = 'user'"> I Am a Regular user </button>
                            <button type="submit" @click="state.form.type = 'seller'"> Join As a Seller </button>
                        </div>
                    </Modal>
                    <input required minlength="4" v-model="state.form.name" type="text" placeholder="Enter Full Name">
                    <input required minlength="5" v-model="state.form.email" type="email" placeholder="Email">
                    <input required minlength="8" v-model="state.form.password" placeholder="Password">
                    <input required minlength="8" v-model="state.form.cpassword" type="cpassword" placeholder="Confirm Password">
                    <button type="button" @click="modal.buyer_or_seller = true">Signup</button>
                    <p class="error-box text-red"> {{ state.error }}</p>
                    <p class="message">Already registered ? <RouterLink to="login">Login </RouterLink>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

import axios from "axios"
import Modal from "../components/Modal.vue"
import { reactive } from "vue";
import { API } from "../constant"
import { useRouter } from "vue-router";

const router = useRouter()

const state = reactive({
    form: {
        name: "",
        email: "",
        password: "",
        cpassword: "",
        type: ''
    },
    error: ''
})

const modal = reactive({
    buyer_or_seller: false
})

function signup() {
    if (state.form.password != state.form.cpassword) return state.error = "Password does not match";

    const data = {
        name: state.form.name,
        email: state.form.email.toLowerCase(),
        password: state.form.password,
        type: state.form.type
    }

    axios.post(API + '/signup', data)
        .then((res) => {

            state.error = '';

            if (res.status !== 200) throw new Error('Try again later');

            router.push('/login')


        }).catch((error) => {
            state.error = error?.response?.data?.message || 'Network issue'

        })
}

</script>
<style scoped>
.box {
    --first-color: #e7eaf6;
    --second-color: #a2a8d3;
    --third-color: #38598b;
    --fourth-color: #113f67;
    --input-bgcolor: #f2f2f2;
    text-align: center;
    margin: auto;
    height: 100%;
    width: 100%;
    background-color: #d4d9fd;
    padding-top: 40px;
}

.options_buyer_seller {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    gap: 10px;

}

.form .options_buyer_seller button {
    padding: 10px;
    height: 100px;
    font-weight: 900;
    font-size: 24px;
    background: white;
    border-radius: 5px;
    color: black;
}

.form .options_buyer_seller button:hover {
    color: white;
}

.error-box {
    margin: 10px 0;
}

.login-page {
    width: 400px;
    margin: auto;
    margin-top: 50px;
}

.form {
    position: relative;
    z-index: 1;
    background: #FFFFFF;
    max-width: 400px;
    margin: 0 auto 100px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1), 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.form input {
    outline: 0;
    background: var(--input-bgcolor);
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 1rem;
    font-size: 0.9rem;
}

.form button {
    text-transform: uppercase;
    outline: 0;
    background: var(--fourth-color);
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 1rem;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    cursor: pointer;
}

.form button:hover,
.form button:active,
.form button:focus {
    background: var(--third-color);
}

.form .message {
    margin: 15px 0 0;
    color: var(--second-color);
    font-size: 0.8rem;
}

.form .message a {
    color: var(--third-color);
    text-decoration: none;
}

.form .register-form {
    display: none;
}

@media screen and (max-width:600px) {
    .login-page {
        width: 100%;
    }

    .form {
        padding: 60px;
        padding-inline: 10px;
    }

}
</style>