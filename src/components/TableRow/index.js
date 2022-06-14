import React from 'react'

function TableRow(props) {
  return (
    <tr>
      <td>{props.data.CustomerID}</td>
      <td>{props.data.CustomerName}</td>
      <td>{props.data.Age}</td>
      <td>{props.data.Qualification}</td>
      <td>{props.data.Income}</td>
      <td>{props.data.WorkExp}</td>
      <td>{props.data.NumofHousehold}</td>
      <td>{props.data.Region}</td>
      <td>{props.data.State}</td>
      <td>{props.data.AccountBalance}</td>
      <td>{props.data.RelationShipTenure}</td>
      <td>{props.data.NumberofAccounts}</td>
      <td>{props.data.TypeofAccount}</td>
      <td>{props.data.EmploymentStatus?"true":"false"}</td>
    </tr>
  )
}

export default TableRow