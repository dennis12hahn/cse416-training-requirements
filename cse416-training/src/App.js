import React from 'react';
import { useTable } from 'react-table';
import 'bootstrap/dist/css/bootstrap.css';

import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useColelctionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAs4XIS-dzpP36B95QQa4z0bk_PR8S53lk",
  authDomain: "cse416-training.firebaseapp.com",
  projectId: "cse416-training",
  storageBucket: "cse416-training.appspot.com",
  messagingSenderId: "838408399543",
  appId: "1:838408399543:web:6c11f4dc6956fed2757b32",
  measurementId: "G-E7F66BCT9L"
});

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <table class="table table-striped table-hover table-sm border table-responsive-sm mx-auto my-5 w-50"
      {...getTableProps()} > 
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function App() {

  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'first_name',
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Gender',
        accessor: 'gender',
      }],
    []
  )

  const data = React.useMemo(() => require('./MOCK_DATA.json'), [])

  return (
    <Table columns={columns} data={data} />
  );
}

export default App;
