<script>
  // @ts-nocheck

  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../firebase";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import Notas from "./notas.svelte";
  import {
    addDoc,
    collection,
    onSnapshot,
    QuerySnapshot,
  } from "firebase/firestore";

  export let b = {};
  export let userData = {
    name: "",
    email: "",
  };

  let mostrar = false;

  const autenticar = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        b = user;
        userData.email = user.email;
        userData.name = user.displayName;
        //console.log(user);
        mostrar = true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMesage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
</script>

<main>
  <div class="fondo">
    {#if mostrar === false}
      <div class="app">
        <img
          src="https://www.chanty.com/blog/wp-content/uploads/2020/10/Task-manager-apps-740x380.jpg"
          alt=""
        />
        <div class="login">
          <h1>Task app</h1>
          <p>Task app built in svelte and hosted in firebase</p>
          <p>Login with Goole and get a free task manager</p>
          <div class="button">
            <button type="submit" on:click={autenticar}>Login</button>
          </div>
        </div>
      </div>
    {/if}
    {#if mostrar === true}
      <Notas {userData} />
    {/if}
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter&family=Roboto:wght@900&display=swap");
  div {
    font-family: Inter;
  }
  button {
    font-family: Inter;
    background-color: rgb(0, 140, 255);
    color: white;
    font-weight: bold;
    width: 60px;
    height: 40px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  img {
    position: absolute;
    top: 10%;
    height: 80%;
    width: 60%;
    right: 10%;
  }
  .app {
    display: flex;
    justify-content: left;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .login {
    margin-left: 50px;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: left;
  }
  h1 {
    font-size: 3rem;
    font-weight: bolder;
    font-family: Roboto;
  }
  .button {
    margin-left: 20px;
  }
  p {
    margin-top: -10px;
    margin-left: 20px;
  }
</style>
