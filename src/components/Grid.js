import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 3px #5d8aaf;
  border-radius: 5px;
  max-width: 1120px;
  margin-top: 40px auto;
  word-break: break-all;
  border-top: 2px solid #2b739f;
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;
export const Tr = styled.tr``;

export const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const FilterInput = styled.input`
  width: 97%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #2b739f;
  box-shadow: 0px 0px 3px #5d8aaf;
  max-width: 1120px;
`;

const PasswordModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
`;

const Grid = ({ users, setUsers, setOnEdit }) => {
  const [filter, setFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const correctPassword = process.env.REACT_APP_PASSWORD;
  
 
  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.Equipamento.toLowerCase().includes(filter.toLowerCase()) ||
          user.Subestacao.toLowerCase().includes(filter.toLowerCase()) ||
          user.plc.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, users]);

  const requestPassword = (action, item) => {
    setSelectedAction(action);
    setSelectedItem(item);
    setPasswordPrompt(true);
  };

  const confirmPassword = (inputPassword) => {
    if (inputPassword === correctPassword) {
      if (selectedAction === "edit") {
        handleEdit(selectedItem);
      } else if (selectedAction === "delete") {
        handleDelete(selectedItem.id);
      }
      setPasswordPrompt(false);
      setSelectedAction(null);
      setSelectedItem(null);
    } else {
      toast.error("Senha incorreta!");
    }
  };

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    await axios
      .delete("https://api-crud-251s.onrender.com/" + id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.id !== id);

        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  };

  return (
    <>
      <FilterInput
        type="text"
        placeholder="Pesquise aqui..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Table>
        <Thead>
          <Tr>
            <Th>Equipamento</Th>
            <Th>Subestação</Th>
            <Th onlyWeb>PLC</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((item, i) => (
            <Tr key={i}>
              <Td width="30%">{item.Equipamento}</Td>
              <Td width="30%">{item.Subestacao}</Td>
              <Td width="20%" onlyWeb>
                {item.plc}
              </Td>
              <Td alignCenter width="5%">
                <FaEdit onClick={() => requestPassword("edit", item)} color="DarkGreen" />
              </Td>
              <Td alignCenter width="5%">
                <FaTrash onClick={() => requestPassword("delete", item)} color="OrangeRed" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {passwordPrompt && (
        <PasswordModal>
          <ModalContent>
            <p>Digite a senha para confirmar a ação:</p>
            <input
              type="password"
              onKeyPress={(e) => {
                if (e.key === "Enter") confirmPassword(e.target.value);
              }}
            />
            <button onClick={() => setPasswordPrompt(false)}>Cancelar</button>
          </ModalContent>
        </PasswordModal>
      )}
    </>
  );
};

export default Grid;
