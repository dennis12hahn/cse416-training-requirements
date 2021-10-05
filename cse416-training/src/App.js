import React from "react";
import { useTable } from "react-table";
import "bootstrap/dist/css/bootstrap.css";

import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useColelctionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAs4XIS-dzpP36B95QQa4z0bk_PR8S53lk",
  authDomain: "cse416-training.firebaseapp.com",
  projectId: "cse416-training",
  storageBucket: "cse416-training.appspot.com",
  messagingSenderId: "838408399543",
  appId: "1:838408399543:web:6c11f4dc6956fed2757b32",
  measurementId: "G-E7F66BCT9L",
});

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

  return <input value={value} onChange={onChange} onBlur={onBlur} />
};

const defaultColumn = {
  Cell: EditableCell
}

function Table({ columns, data, updateMyData, skipPageReset }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data, defaultColumn, autoResetPage: !skipPageReset, updateMyData });

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
  const columns = React.useMemo(
    () => [
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
    ],
    []
  );

  const [data, setData] = React.useState(() => require("./MOCK_DATA.json"), []);
  const [originalData] = React.useState(data)
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data])

  return <Table columns={columns} data={data} updateMyData={updateMyData} />;
}

export default App;
