import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";
import "./css/styles.css";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  // useEffect para obtener datos de firebase
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("tareas").get();
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTareas(arrayData);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, []);
  // función agregar tarea a firebase
  const agregar = async (event) => {
    event.preventDefault();
    if (!tarea.trim()) {
      setError("Por favor ingrese tarea...");
      return
    }
    setError('');
    try {
      const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };
      const data = await db.collection("tareas").add(nuevaTarea);

      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
      // Reiniciar input de tarea
      setTarea('');
    } catch (error) {
      console.log(error);
    }
  };
  // función para eliminar tarea
  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).delete();

      const arrayFiltrado = tareas.filter((item) => item.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };
  // función para editar tarea
  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };

  const editar = async (event) => {
    event.preventDefault();
    if (!tarea.trim()) {
      setError("Por favor ingrese tarea...");
      return
    }
    setError('');
    try {
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).update({
        name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id:item.id, fecha: item.fecha ,name: tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false);
      setTarea('');
      setId('');
    } catch (error) {
      console.log(error)
    }
  };
  // función para cancelar modo edición
  const cancelar = () => {
    setModoEdicion(false);
    setTarea('');
  };

  return (
    <div className="container">
      <h1 className="text-center my-5 things-to-do ">Things To Do</h1>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center sub-section">Lista de Tareas</h2>
          <ul className="list-group mt-5 mb-3">
            {tareas.map((item) => {
              return (
                <li
                  key={item.id}
                  className="list-group-item mb-2 p-3 text-dark shadows"
                >
                  <span className="font-weight-bold">Fecha: </span>
                  {item.fecha} - {item.name}
                  <button
                    className="btn btn-delete float-right btn-sm"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn- 
                  btn-edit float-right 
                  btn-sm mr-2"
                    onClick={() => activarEdicion(item)}
                  >
                    Editar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-md-6">
          <h2 className="text-center sub-section">
            {modoEdicion ? "Editar Tarea" : "Agregar Tarea"}
          </h2>
          <p className="text-error">{error}</p>
          <form className="mt-5 mb-5" onSubmit={modoEdicion ? editar : agregar}>
            <input
              type="text"
              placeholder="Inserte la tarea"
              className="form-control mb-5 shadows"
              onChange={(event) => setTarea(event.target.value)}
              value={tarea}
            />
            <button
              type="submit"
              className={modoEdicion ? "btn btn-edit " : "btn  btn-agregar"}
            >
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
            {modoEdicion && (
              <button
                type="submit"
                className="btn btn-delete ml-3"
                onClick={() => cancelar()}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
