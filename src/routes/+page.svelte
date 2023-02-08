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
    width: 90px;
    height: 40px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .app {
    background-color: #e5e5f7;
    opacity: 1;
    background-image: radial-gradient(#d3d3d3 2px, #ffffff 2px);
    background-size: 40px 40px;
    display: flex;

    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .login {
    background-color: white;
    margin-left: 2%;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    border: 1px solid grey;
    width: 300px;
    height: 300px;
    border-radius: 5px;
    margin-top: 40px;
  }
  h1 {
    font-size: 2rem;
    font-weight: bolder;
    font-family: Roboto;
  }
  .button {
  }
  p {
  }
</style>
