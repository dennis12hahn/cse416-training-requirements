import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import "bootstrap/dist/css/bootstrap.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs4XIS-dzpP36B95QQa4z0bk_PR8S53lk",
  authDomain: "cse416-training.firebaseapp.com",
  projectId: "cse416-training",
  storageBucket: "cse416-training.appspot.com",
  messagingSenderId: "838408399543",
  appId: "1:838408399543:web:6c11f4dc6956fed2757b32",
  measurementId: "G-E7F66BCT9L",
};

const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

const defaultColumn = {
  Cell: EditableCell,
};

function Table({ columns, data, updateMyData, skipPageReset }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    });

  return (
    <table
      class="table table-striped table-hover table-sm border table-responsive-sm mx-auto my-5 w-50"
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  // const [data, setData] = React.useState(() => require("./MOCK_DATA.json"), []);

  useState(() => {
    firestore.collection("users").onSnapshot((snapshot) => {
      setData(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  const [data, setData] = React.useState([]);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Delete",
        id: "delete",
        accessor: (str) => "delete",
        Cell: (tableProps) => (
          <button
            class="btn btn-danger btn-sm"
            onClick={() => {
              const dataCopy = [...data];
              const user_ref = firestore
                .collection("users")
                .where("id", "==", dataCopy[tableProps.row.index].id)
                .limit(1);

              let batch = firestore.batch();

              user_ref.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  batch.delete(doc.ref);
                  dataCopy.splice(tableProps.row.index, 1);
                  setData(dataCopy);
                });
                return batch.commit();
              });
            }}
          >
            x
          </button>
        ),
      },
      {
        Header: "Insert",
        id: "insert",
        accessor: (str) => "insert",
        Cell: (tableProps) => (
          <button
            class="btn btn-success btn-sm"
            onClick={() => {
              const dataCopy = [...data];

              const new_user = {
                gender: "",
                first_name: "",
                last_name: "",
                email: "",
                id: "",
              };

              const query = firestore
                .collection("users")
                .orderBy("id", "desc")
                .limit(1);

              query.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  new_user.id = doc.get("id") + 1;
                  dataCopy.push(new_user);
                  setData(dataCopy);
                  firestore.collection("users").add(new_user);
                });
              });
            }}
          >
            +
          </button>
        ),
      },
    ],
    [data]
  );

  const updateMyData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          try {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          } finally {
            const user_ref = firestore
              .collection("users")
              .where("id", "==", old[index].id)
              .limit(1);

            let batch = firestore.batch();
            const user = old[index];
            console.log(user);

            user_ref.get().then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, user);
              });
              return batch.commit();
            });
          }
        }
        return row;
      })
    );
  };

  return (
    <div>
      <div
        style={{
          margin: "auto",
          width: "50%",
          padding: "10px",
        }}
      >
        <button
          class="btn btn-primary btn-success"
          style={{ marginLeft: "50%" }}
          onClick={() => {
            const dataCopy = [...data];

            const new_user = {
              gender: "",
              first_name: "",
              last_name: "",
              email: "",
              id: "",
            };

            var no_users = false;

            if (dataCopy.length === 0) {
              no_users = true;
              new_user.id = 1;
              dataCopy.push(new_user);
              setData(dataCopy);
              firestore.collection("users").add(new_user);
            } else {
              const query = firestore
                .collection("users")
                .orderBy("id", "desc")
                .limit(1);

              query.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  new_user.id = doc.get("id") + 1;
                  dataCopy.push(new_user);
                  setData(dataCopy);
                  firestore.collection("users").add(new_user);
                });
              });
            }
          }}
        >
          Add New
        </button>
      </div>
      <Table columns={columns} data={data} updateMyData={updateMyData} />;
    </div>
  );
}

export default App;
