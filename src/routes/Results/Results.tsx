import { FormEvent, useState } from "react";

const Results = () => {

  // const [addLabel, setAddLabel] = useState('');
  // const [addValue, setAddValue] = useState('');

  // const [retrieveLabel, setRetrieveLabel] = useState('');
  // const [retrieveValue, setRetrieveValue] = useState('');

  // const [deleteLabel, setDeleteLabel] = useState('');
  // const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);

  // const [deleteConfirmLabel, setDeleteConfirmLabel] = useState('');
  // const [isDeleteConfirm, setIsDeleteConfirm] = useState('');


  function addToStorage(key: string, value: string): void {

    try {

      let storedValue = retrieveFromStorage(key);
      if (storedValue !== null) {
        throw new ReferenceError(`Unable to add new value with Key: ${key}.  That key is already in use.`);
      }

      localStorage.setItem(key, value);

    } catch (err) {
      console.error(`Key: ${key} addToStorage catch error:`, err);

      throw err;
    }

  }

  function retrieveFromStorage(key: string): string | null {

    try {
      let storedValue = localStorage.getItem(key);

      return storedValue;
    }
    catch (err) {
      console.error(`Key: ${key} retrieveFromStorage catch error:`, err);
      throw err;
    }
  }



  function removeFromStorage(evt: FormEvent): void {

    evt.preventDefault();

    let deleteMessage = localStorage.removeItem(deleteLabel);

    console.log('deleteMessage', deleteMessage);

    let checkDeletedValue = localStorage.getItem(deleteLabel);

    if (checkDeletedValue) {
      setIsDeleteSuccessful(false);
      alert(`Error Deleting stored item with label: ${deleteLabel}`);
      setDeleteLabel('');
    } else {
      setIsDeleteSuccessful(true);
    }

  }

  return (
    <>
      <h3>Results</h3>

      {/* <section>

        <h4>Add to Storage</h4>

        <form onSubmit={addToStorage}>
          <label>
            Label:
            <input type='text' placeholder="label" value={addLabel} onChange={(evt) => { setAddLabel(evt.target.value) }}></input>
          </label>

          <label>
            Value:
            <input type='text' placeholder="value" value={addValue} onChange={(evt) => { setAddValue(evt.target.value) }}></input>
          </label>

          <button type='submit'>Submit</button>
        </form>

      </section> */}

      {/* <section>

        <h4>Retrieve from Storage</h4>

        <form onSubmit={setRetrieveValue}>
          <label>
            Label:
            <input type='text' placeholder="label" value={retrieveLabel} onChange={(evt) => { setRetrieveLabel(evt.target.value) }}></input>
          </label>

          <button type='submit'>Retrieve Storage</button>
        </form>

        <div>
          {retrieveValue ? <p>Label: {retrieveLabel} has Value: {retrieveValue}</p> : <p></p>}
        </div>

      </section > */}

      {/* <section>

        <h4>Delete from Storage</h4>

        <form onSubmit={removeFromStorage}>
          <label>
            Label:
            <input type='text' placeholder="label" value={deleteLabel} onChange={(evt) => { setDeleteLabel(evt.target.value) }}></input>
          </label>

          <button type='submit'>Retrieve Storage</button>
        </form>

        <div>
          {isDeleteSuccessful ? <p>Label: {deleteLabel} has been deleted!</p> : <p>Error deleting value with Label: {deleteLabel}</p>}
        </div>

      </section> */}

    </>
  );
};

export default Results;
