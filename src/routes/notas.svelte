<script>
  // @ts-nocheck
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../firebase";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import { onDestroy } from "svelte";
  import {
    addDoc,
    collection,
    deleteDoc,
    onSnapshot,
    QuerySnapshot,
    doc,
    updateDoc,
  } from "firebase/firestore";

  export let userData = {};
  let prueba = {
    titulo: "",
    desc: "",
  };
  let tareas = [];
  let editStatus = false;
  let currentId = "";
  let error = false;
  let borrar = false;
  let logout = false;

  const cerrarSesion = () => {
    document.location.reload();
  };

  const addTask = async () => {
    console.log(prueba.titulo === "");
    if (prueba.titulo === "" || prueba.desc === "") {
      error = !error;
      return;
    }
    await addDoc(collection(db, userData.name), prueba);
    crear = !crear;
  };

  const updateTask = async () => {
    try {
      await updateDoc(doc(db, userData.name, currentId), prueba);
    } catch (error) {
      console.error(error);
    }
    crear = !crear;
    editStatus = false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editStatus) {
      updateTask();
    } else {
      addTask();
    }

    let prueba = {
      titulo: "",
      desc: "",
    };
    currentId = "";
    editStatus = false;
  };

  const editarTarea = async (tarea) => {
    prueba.titulo = tarea.titulo;
    prueba.desc = tarea.desc;
    crear = !crear;
    currentId = tarea.id;
    editStatus = true;
  };

  const borrarTarea = async (id) => {
    await deleteDoc(doc(db, userData.name, id));
  };

  const borrarTodo = async () => {
    await tareas.map((tarea) => {
      deleteDoc(doc(db, userData.name, tarea.id));
    });
    borrar = !borrar;
  };

  let crear = false;

  const unsub = onSnapshot(collection(db, userData.name), (QuerySnapshot) => {
    tareas = QuerySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    console.log(tareas);
  });
  onDestroy(unsub);
</script>

<div class="mostrar">
  <div class="navbar">
    <h1 class="h1">Bienvenid@, {userData.name}</h1>
    <div class="b">
      <button class="crear" on:click={() => (crear = !crear)}>Crear</button>
      <button on:click={() => (borrar = !borrar)}>Borrar todo</button>
      <button on:click={() => (logout = !logout)}>Logout</button>
    </div>
  </div>
  {#if crear === true}
    <div class="todo">
      <form on:submit={handleSubmit}>
        <div class="cabecera">
          {#if editStatus === true}
            <h2>Editar tarea</h2>
          {/if}
          {#if editStatus === false}
            <h2>Crear tarea</h2>
          {/if}
        </div>
        <label for="">Titulo</label>
        <input
          maxlength="20"
          bind:value={prueba.titulo}
          type="text"
          placeholder="introduce el titulo"
        /><label for="">Tarea</label>
        <input
          bind:value={prueba.desc}
          type="text"
          name=""
          id=""
          placeholder="introduce la tarea"
        />
        <div class="buttons2">
          <button type="submit">Crear</button>
          <button on:click={() => (crear = !crear)}>Cerrar</button>
        </div>
      </form>
    </div>
  {/if}
  {#if borrar === true}
    <div class="todo">
      <div class="borrartodo">
        <div class="cu">
          <h3>Estas seguro de borrar todo</h3>
        </div>
        <p>Todos tus datos se perderan</p>
        <div class="borrarb">
          <button on:click={borrarTodo}>Borrar</button>
          <button on:click={() => (borrar = !borrar)}>Cancelar</button>
        </div>
      </div>
    </div>
  {/if}
  {#if logout === true}
    <div class="todo">
      <div class="borrartodo">
        <div class="" style="text-align:center">
          <h3>Estas seguro de que quieres salir?</h3>
        </div>
        <div class="borrarb">
          <button on:click={cerrarSesion}>Logout</button>
          <button on:click={() => (logout = !logout)}>Cancelar</button>
        </div>
      </div>
    </div>
  {/if}
  {#if error === true}
    <div class="todo">
      <div class="borrartodo">
        <div class="" style="text-align:center">
          <h3>Todas las notas deben de tener un titulo y descripcion</h3>
        </div>
        <div class="borrarb">
          <button on:click={() => (error = !error)}>Cancelar</button>
        </div>
      </div>
    </div>
  {/if}
  <div class="app">
    {#each tareas as tarea}
      <div class="tarea">
        <div class="cabecera2">
          <h4>{tarea.titulo}</h4>
        </div>
        <div class="p">
          <p>{tarea.desc}</p>
        </div>
        <div class="buttons">
          <button on:click={editarTarea(tarea)}>Editar</button>
          <button on:click={borrarTarea(tarea.id)}>Borrar</button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .p {
    word-wrap: break-word;
    width: 90%;
  }
  .mostrar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .todo {
    position: fixed;
    top: 0;
    left: 0;
    transition: 0.4s;
    width: 100%;
    height: 100%;
    background-color: rgba(1, 1, 1, 0.4);
    display: flex;
    justify-content: center;
    z-index: 2;
    overflow: hidden;
  }
  .buttons {
    display: flex;
    gap: 40px;
    margin-bottom: 10px;
    margin-top: 30px;
  }
  .buttons > button {
    height: 30px;
    width: 70px;
    font-family: Inter;
    border-radius: 4px;
    cursor: pointer;
  }
  .buttons > :nth-child(1) {
    border: none;
    background-color: rgb(0, 119, 255);
    color: white;
  }
  .buttons > :nth-child(2) {
    background-color: red;
    color: white;
    border: none;
  }
  .borrartodo {
    z-index: 3;
    margin-top: 10%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    width: 340px;
    height: 200px;
    border-radius: 3px;
    overflow: hidden;
    border-radius: 20px;

    animation-name: popup;
    animation-duration: 0.3s;
    animation-iteration-count: 1;
  }
  .borrarb {
    display: flex;
    gap: 30px;
  }
  .borrarb > button {
    cursor: pointer;
    width: 80px;
    height: 30px;
    font-family: Inter;
  }
  .borrarb > :nth-child(1) {
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
  }
  .borrarb > :nth-child(2) {
    background-color: white;
    border: 1px solid rgb(167, 167, 167);
    border-radius: 4px;
    color: rgb(0, 60, 255);
  }
  .borrartodo > p {
    margin-top: -20px;
  }

  @keyframes popup {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .cabecera {
    text-align: center;
    margin-top: -30px;
    color: white;
    width: 100%;
    background-color: rgb(0, 119, 255);
  }
  .cabecera2 {
    text-align: center;
    color: white;

    width: 100%;
    background-color: rgb(0, 119, 255);
  }
  .buttons2 > :nth-child(1) {
    background-color: rgb(0, 119, 255);
    border: none;
    color: white;
  }
  .buttons2 > :nth-child(2) {
    background-color: white;
    border: 1px solid rgb(167, 167, 167);
    color: rgb(0, 60, 255);
  }
  .buttons2 > button {
    height: 30px;
    width: 60px;
    font-size: 0.9rem;
    border-radius: 5px;
    cursor: pointer;
  }
  .buttons2 {
    display: flex;
    gap: 30px;
  }
  form {
    z-index: 3;
    margin-top: 10%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    width: 500px;
    height: 300px;
    border-radius: 3px;
    overflow: hidden;
    border-radius: 20px;

    animation-name: popup;
    animation-duration: 0.3s;
    animation-iteration-count: 1;
  }
  form > label {
    margin-bottom: -10px;
    margin-left: -80%;
    font-size: 0.9rem;
  }
  form > input {
    width: 90%;
    outline: none;
    border: 1px solid rgb(167, 167, 167);
    height: 30px;
    border-radius: 5px;
    font-size: 1rem;
    text-indent: 20px;
  }
  form > input:focus {
    border: 1px solid rgb(0, 119, 255);
  }
  .h1 {
    margin-left: 40px;
    text-transform: capitalize;
    font-size: 1.7rem;
    font-weight: normal;
  }
  .navbar {
    position: fixed;
    width: 100%;
    height: 50px;
    display: flex;
    overflow: hidden;
    align-items: center;
    box-shadow: 1px 1px 1px 1px rgba(1, 1, 1, 0.2);
  }
  .b {
    position: absolute;
    right: 50px;
    display: flex;
    gap: 10px;
  }
  .b > :first-child {
    border: none;
    background-color: rgb(0, 119, 255);
    border-radius: 3px;
    color: white;
  }

  .b > :nth-child(2),
  .b > :nth-last-child(1) {
    background-color: white;
    border: 1px solid rgb(177, 177, 177);
    border-radius: 3px;
    color: rgb(0, 60, 255);
  }
  .b > button {
    font-family: Inter;
    height: 30px;
    cursor: pointer;
    font-weight: 500;
  }
  .app {
    position: absolute;
    top: 120px;
    margin: auto;
    width: 95%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    column-gap: 2%;
    z-index: 1;
  }
  .tarea {
    overflow: hidden;
    margin-top: 30px;
    border: 1px solid rgb(177, 177, 177);
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
