<template>
    <div class="box">
        <h1>Login</h1>
        <div class="login-page">
            <div class="form">
                <form @submit.prevent="login" class="login-form">
                    <input required minlength="5" v-model="state.form.email" type="email" placeholder="Email">
                    <input required minlength="8" v-model="state.form.password" type="password" placeholder="Password">
                    <button>Login</button>
                    <p class="error-box text-red"> {{ state.error }}</p>
                    <p class="message">Not registered ? <RouterLink to="signup">Create an Account</RouterLink>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

import axios from "axios"
import { reactive } from "vue";
import { API } from "../constant"
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
    form: {
        name: "",
        email: "",
        password: "",
        cpassword: "",
    },
    error: ''
})


function login() {

    const data = {
        email: state.form.email.toLowerCase(),
        password: state.form.password
    }

    axios.post(API + '/login', data)
        .then((res) => {

            const token = res.data.data.token

            state.error = '';
            localStorage.clear();
            localStorage.setItem('token', token);

            if (res.data.data.role === 'admin') return router.push('/admin');
            if (res.data.data.role == 'seller') return router.push('/seller');

            return router.push('/home')

        }).catch((error) => {
            state.error = error?.response?.data?.message || 'Network issue'
        })
}


</script>

<style scoped>
.box {
    width: 100%;
    --first-color: #e7eaf6;
    --second-color: #a2a8d3;
    --third-color: #38598b;
    --fourth-color: #113f67;
    --input-bgcolor: #f2f2f2;
    text-align: center;
    margin: auto;
    height: 100%;
    background-color: #d4d9fd;
    padding-top: 40px;
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

.error-box {
    margin: 10px 0;
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