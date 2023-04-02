import React, { useState, useEffect } from 'react';

function App() {
  const [elements, setElements] = useState([]);
  const [editingElement, setEditingElement] = useState(null);
  useEffect(() => {
    fetch('https://api-generator.retool.com/nxXN2b/jsonserver')
      .then(response => response.json())
      .then(data => setElements(data))
      .catch(error => console.error(error));
  }, []);

  const addElement = (element) => {
    fetch('https://api-generator.retool.com/nxXN2b/jsonserver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(element)
    })
      .then(response => response.json())
      .then(data => setElements([...elements, data]))
      .catch(error => console.error(error));
  };

  const updateElement = (id, updatedElement) => {
    fetch(`https://api-generator.retool.com/nxXN2b/jsonserver/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedElement)
    })
      .then(response => response.json())
      .then(data => {
        const index = elements.findIndex(element => element.id === id);
        const updatedElements = [...elements];
        updatedElements[index] = data;
        setElements(updatedElements);
      })
      .catch(error => console.error(error));
  };

  const deleteElement = (id) => {
    fetch(`https://api-generator.retool.com/nxXN2b/jsonserver/${id}`, {
      method: 'DELETE'
    })
      .then(() => setElements(elements.filter(element => element.id !== id)))
      .catch(error => console.error(error));
  };
  const editElement = (element) => {
    setEditingElement(element);
  };

  const cancelEdit = () => {
    setEditingElement(null);
  };
  return (
    <div>
      <h1>Elements</h1>
      <ul>
        {elements.map(element => (
          <li key={element.id}>
            {editingElement && editingElement.id === element.id ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                const name = event.target.elements.name.value;
                const lastname = event.target.elements.lastname.value;
                updateElement(element.id, { name, lastname });
              }}>
                <input type="text" name="name" defaultValue={element.name} />
                <input type="text" name="lastname" defaultValue={element.lastname} />
                <button type="submit">Save</button>
                <button type="button" onClick={() => cancelEdit()}>Cancel</button>
              </form>
            ) : (
              <>
                <span>{element.name}  {element.lastname}  </span>
               
                <button onClick={() => deleteElement(element.id)}>Delete   </button>
                <button onClick={() => editElement(element)}>   Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {!editingElement && (
        <form onSubmit={(event) => {
          event.preventDefault();
          const name = event.target.elements.name.value;
          const lastname = event.target.elements.lastname.value;
          addElement({ name, lastname });
          event.target.reset();
        }}>
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="lastname" placeholder="lastname" />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default App;
