import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #2b739f;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #0000cd;
  color: white;
  height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.Equipamento.value = onEdit.Equipamento;
      user.Subestacao.value = onEdit.Subestacao;
      user.plc.value = onEdit.plc;
          }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.Equipamento.value ||
      !user.Subestacao.value ||
      !user.plc.value 
   
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put("http://localhost:8800/" + onEdit.id, {
          Equipamento: user.Equipamento.value,
          Subestacao: user.Subestacao.value,
          plc: user.plc.value,
        
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:8800", {
          Equipamento: user.Equipamento.value,
          Subestacao: user.Subestacao.value,
          plc: user.plc.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    user.Equipamento.value = "";
    user.Subestacao.value = "";
    user.plc.value = "";


    setOnEdit(null);
    getUsers();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Equipamento</Label>
        <Input name="Equipamento" />
      </InputArea>
      <InputArea>
        <Label>Subestação</Label>
        <Input name="Subestacao"  />
      </InputArea>
      <InputArea>
        <Label>PLC</Label>
        <Input name="plc" />
      </InputArea>
   

      <Button type="submit">SALVAR</Button>
        
      </FormContainer>

     

  );

  

  
};



export default Form;