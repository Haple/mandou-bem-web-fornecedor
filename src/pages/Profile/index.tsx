import React, { useCallback, useRef, useState } from 'react';
import { FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '~/services/api';
import { useToast } from '~/hooks/toast';
import { useAuth } from '~/hooks/auth';
import getValidationErrors from '~/utils/getValidationErrors';

import Input from '~/components/Input';
import Button from '~/components/Button';
import Header from '~/components/Header';
import Loading from '~/components/Loading';

import { Container, Content, LogoutButton } from './styles';

interface ProfileFormData {
  company_name: string;
  cnpj: string;
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { provider: user, updateProvider: updateUser, signOut } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          company_name: Yup.string().required('Razão social obrigatória'),
          cnpj: Yup.string().required('CNPJ obrigatório'),
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.lenght,
            then: Yup.string()
              .min(6, 'No mínimo 6 dígitos')
              .required('Campo Obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.lenght,
              then: Yup.string()
                .min(6, 'No mínimo 6 dígitos')
                .required('Campo Obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          company_name,
          cnpj,
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          company_name,
          cnpj,
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/provider/profile', formData);

        updateUser(response.data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description:
            'Suas informações do perfil foram atualizadas com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualização perfil, tente novamente',
        });
      }
      setLoading(false);
    },
    [addToast, history, updateUser],
  );

  return (
    <>
      <Loading loading={loading} />
      <Header />
      <Container>
        <Content>
          <Form
            ref={formRef}
            initialData={{
              company_name: user.company_name,
              cnpj: user.cnpj,
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <Input name="company_name" icon={FiUser} label="Razão Social" />
            <Input name="cnpj" icon={FiUser} label="CNPJ" />
            <Input name="name" icon={FiUser} label="Nome" />
            <Input name="email" icon={FiMail} label="E-mail" />

            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon={FiLock}
              type="password"
              label="Senha atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              label="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              label="Confirmar senha"
            />

            <Button type="submit">Confirmar Mudanças</Button>
            <LogoutButton type="button" onClick={signOut}>
              Deslogar
            </LogoutButton>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Profile;
