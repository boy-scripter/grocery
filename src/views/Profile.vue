<template>
    <section>
        <div className="cont">
            <h1 className="my_account">My Account</h1>


            <form class="inputs" @submit.prevent="update_profile">
                <label for="">
                    Enter Name <br>
                    <input type="text" v-model="form.name">
                </label>
                <label for="">
                    Enter Email <br>
                    <input type="text" v-model="form.email">
                </label>

                <button type=" btn submit">Update</button>
                <div class="">{{ form.error }}</div>


            </form>


            <h3 class="changepwd">Change Password</h3>

            <form class="inputs" @submit.prevent="update_password">

                <label for="">
                    Enter New Password <br>
                    <input type="password" v-model="form.password">
                </label>
                <label for="">
                    Confirm New Password <br>
                    <input type="password" v-model="form.cpassword">
                </label>


                <button type="submit btn">Update</button>
                <div class="">{{ form.error2 }}</div>

            </form>

        </div>
    </section>
</template>
  
<script setup>

import { reactive } from 'vue';
import { onMounted } from 'vue';
import { API } from '../constant';
import axios from 'axios';


let headers = { Authorization: localStorage.getItem('token') }

const form = reactive({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    error: '',
    error2: ''
})

function update_profile() {
    axios.post(API + '/user/update_profile', {
        name: form.name,
        email: form.email
    }, { headers })
        .then(res => form.error = res.data.message)
        .catch(error => form.error = error.message)
}

function update_password() {
    if (form.cpassword != form.password) return form.error2 = "Password doesn't match"
    axios.post(API + '/user/update_password', {
        password: form.password,
    }, { headers })
        .then(res => form.error2 = res.data.message)
        .catch(error => form.error2 = error.message)
}

onMounted(() => {
    axios.get(API + '/user/profile', { headers })
        .then(res => {
            form.name = res.data.data.name
            form.email = res.data.data.email
        })
})

</script>
  
  
<style scoped>
section {
    margin: 10px;
    padding: 5px;
    width: 97%;
}

button {
    all: unset;
    background-color: royalblue;
    padding: 10px;
    color: white;
    border: 1px solid royalblue;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.2s;
}

button:active {
    background-color: white;
    color: royalblue;
    border: 1px solid royalblue;
}

.my_account {
    margin-bottom: 10px;
    text-align: center;
    color: black;
}

.inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 10px;
    column-gap: 40px;
    width: 60%;
    margin: auto;
    justify-content: center;
    text-align: center;
    margin-top: 5px;
    justify-items: start;
}

.inputs:nth-child(1) {
    margin-top: 40px;
}

.inputs input {
    outline: 0;
    background: var(#f2f2f2);
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 10px;
    font-size: 0.9rem;
}

.changepwd {
    margin-top: 30px;
    text-align: center;
    font-size: 25px;
}

.error {
    display: inline-block;
    text-align: center;
    height: 20px;
    color: red;
    margin-left: 10px;
}

input {
    background: white !important;
    border: 1px solid black !important;
}

.name {
    width: 90%;
    margin: auto;
}

.shadow {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

.profile-tab-nav {
    min-width: 250px;
}

.tab-content {
    flex: 1;
}

.form-group {
    margin-bottom: 1.5rem;
}

.nav-pills a.nav-link {
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    color: white;
}

.nav-pills a.nav-link i {
    width: 20px;
}

.nav-pills a.nav-link.active-tab {
    color: white;
    background-color: blue;
}

h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
}

input:invalid {
    border: 2px solid red;
    box-shadow: none;
    outline: none;
}

@media screen and (max-width: 500px) {
    .inputs {
        grid-template-columns: repeat(1, 1fr);
        width: 100%;
        justify-items: center;
    }



    .error {
        font-size: 11.5px;
    }
}
</style>