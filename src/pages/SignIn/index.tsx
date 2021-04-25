import React, { useRef, useCallback } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '~/hooks/auth';
import { useToast } from '~/hooks/toast';
import getValidationErrors from '~/utils/getValidationErrors';

import Input from '~/components/Input';
import Button from '~/components/Button';

import { Container, Content, AnimationContainer } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({ email: data.email, password: data.password });

        history.push('/feed');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <h1>
            Mandou <b>Bem</b>
          </h1>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input name="email" icon={FiMail} label="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              label="Senha"
            />

            <Button type="submit">Entrar</Button>
          </Form>

          <Link to="/forgot-password">Esqueci minha senha</Link>

          <Link to="/signup">
            {/* <FiLogIn /> */}
            Ainda não tem conta?
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
