<template>
    <nav>
        <div class="logo">GROCERY.COM</div>
        <input type="checkbox" id="checkbox">
        <label for="checkbox" id="icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </label>
        <ul>
            <li>
                <RouterLink to="/home/store">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/profile">Profile</RouterLink>
            </li>
            <li>
                <RouterLink to="/checkout">Cart</RouterLink>
            </li>
            <li>
                <RouterLink to="/history">History</RouterLink>
            </li>
            <li>
                <a @click="logout">Logout</a>
            </li>
        </ul>
    </nav>
</template>


<script setup>
import router from '../router';


function logout(){
    router.push('/login')
    localStorage.clear()
}
</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    padding: 15px 5%;
    align-items: center;
    background: #18283B;
}

.logo {
    color: #FFF;
    font-size: 22px;
}

ul {
    list-style: none;
    cursor: pointer;
}

ul li {
    display: inline-block;
    margin-left: 5px;
}

ul li a {
    text-decoration: none;
    color: white;
    padding: 8px 30px;
    border-radius: 7px;
    transition: all .3s ease;
}

ul li a:hover,
ul li a.active {
    color: #FFF;
    background: #0075FF;
}

#icon {
    background-color: #0075FF;
    padding: 5px 7px 3px 7px;
    border-radius: 4px;
    cursor: pointer;
    transition: all .3s ease;
}

#icon svg {
    color: #FFF;
    height: 28px;
    transition: all .3s ease;
}

#icon:hover {
    background: #FFF;
}

#icon:hover svg {
    color: #0075FF;
}

#checkbox,
#icon {
    display: none;
}

/* Youtube link */
.link {
    position: fixed;
    background-color: #D12322;
    padding: 23px 40px;
    right: -100px;
    border-radius: 5px;
    top: 50%;
    transform: translateY(-50%);
    transform: rotate(-90deg);
    font-size: 18px;
    font-weight: 500;
    color: #FFF;
    text-decoration: none;
    text-transform: capitalize;
    transition: all .1s ease-in-out;
}

.link i {
    padding-left: 7px;
}

.link:hover {
    text-decoration: underline;
    background-color: black;
}

@media screen and (max-width: 768px) {
    nav {
        border-bottom: 1px solid #455468;
    }

    ul {
        position: absolute;
        width: 100%;
        height: calc(100vh - 71px);
        background-color: #18283B;
        left: 0;
        top: 0;
        text-align: center;
        display: none;
        margin-top: 71px;
    }

    ul li {
        display: block;
        padding: 10px 15px;
    }

    ul li a {
        display: block;
        padding: 10px 0;
    }

    #icon {
        display: block;
    }

    #checkbox:checked~ul {
        display: block;
    }
}</style>