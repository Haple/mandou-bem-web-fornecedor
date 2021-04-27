import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '~/services/api';

import { useToast } from '~/hooks/toast';

import getValidationErrors from '~/utils/getValidationErrors';

import Input from '~/components/Input';
import Button from '~/components/Button';

import drawBusinessShop from '~/assets/draw-business-shop.svg';

import {
  Container,
  Header,
  HeaderContent,
  Content,
  AnimationContainer,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          cnpj: Yup.string().required('CNPJ obrigatório'),
          company_name: Yup.string().required('Nome do administrador obrigatório'),
          email: Yup.string()
            .required('E-mail do administrador obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
          password_confirmation: Yup.string()
            .required()
            .oneOf([Yup.ref('password')], 'As senhas precisam ser iguais'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/provider/accounts', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon no MandouBem',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  const handleCnpjChange = useCallback(
    async (data) => {

    },[],
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <h2>
            Mandou <b>Bem</b>
          </h2>
        </HeaderContent>
      </Header>

      <img src={drawBusinessShop} alt="Ilustração de pessoas celebrando" />

      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              name="company_name"
              icon={BsBuilding}
              label="Razão social"
            />
            <Input
              mask="cnpj"
              name="cnpj"
              icon={BsBuilding}
              label="CNPJ"
              onChange={handleCnpjChange}
            />
            <Input name="name" icon={FiUser} label="Nome do administrador" />
            <Input name="email" icon={FiMail} label="E-mail do administrador" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              label="Senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              label="Confirmação de senha"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">Já tem uma conta?</Link>
        </AnimationContainer>
        <span>
          Estamos super contentes de te ver por aqui!
          <br />
          <br />
          Nos conte mais sobre você e veja como é fácil se tornar
          nosso parceiro.
        </span>
      </Content>
    </Container>
  );
};

export default SignUp;
