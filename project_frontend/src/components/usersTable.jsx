import React from 'react'

const UsersTable = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Идентификатор пользователя</th>
            <th>Имя пользователя</th>
            <th>ФИО</th>
            <th>Права</th>
            <th>Удалить пользователя</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable