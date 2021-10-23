import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '~/components/Header';

import { Container, Content, GiftCard, AddGiftCard } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Input from '~/components/Input';
import TextArea from '~/components/TextArea';
import Modal from '~/components/Modal';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';

interface IGiftCardData {
  id: string;
  title: string;
  points: number;
  image_url: string;
  units_available: number;
  expiration_days: number;
  description: string;
}

interface INewGiftCard {
  title: string;
  image_url: string;
  points: number;
  units_available: number;
  expiration_days: number;
  description: string;
}

const AdminGiftCards: React.FC = () => {
  const [giftCards, setGiftCards] = useState<IGiftCardData[]>([]);
  const [editingGiftCard, setEditingGiftCard] = useState<IGiftCardData>(
    {} as IGiftCardData,
  );

  const [modalStatusNewGiftCard, setModalStatusNewGiftCard] = useState(false);
  const [modalStatusEditGiftCard, setModalStatusEditGiftCard] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadGiftCards(): Promise<void> {
      const response = await api.get<IGiftCardData[]>('/gift-cards');
      setGiftCards(response.data);
    }

    loadGiftCards();
  }, []);

  const toggleAddModal = useCallback(() => {
    setModalStatusNewGiftCard(!modalStatusNewGiftCard);
  }, [modalStatusNewGiftCard]);

  const toggleEditModal = useCallback(() => {
    setModalStatusEditGiftCard(!modalStatusEditGiftCard);
  }, [modalStatusEditGiftCard]);

  const validateForm = useCallback(async (data: INewGiftCard) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        title: Yup.string().required('Título obrigatório'),
        image_url: Yup.string().url().required('URL da imagem obrigatória'),
        points: Yup.number()
          .positive('Valor inválido')
          .required('Quantidade de pontos obrigatória'),
        units_available: Yup.number()
          .positive('Valor inválido')
          .required('Unidades disponíveis obrigatória'),
        expiration_days: Yup.number()
          .positive('Valor inválido')
          .required('Quantidade de dias de validade obrigatória'),
        description: Yup.string().required(
          'Política de resgate do vale-presente obrigatório',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  const handleAddGiftCard = useCallback(
    async (data: INewGiftCard) => {
      try {
        await validateForm(data);

        const response = await api.post<IGiftCardData>('/gift-cards', {
          title: data.title,
          image_url: data.image_url,
          points: data.points,
          units_available: data.units_available,
          expiration_days: data.expiration_days,
          description: data.description,
        });

        setGiftCards([...giftCards, response.data]);
        toggleAddModal();
        addToast({
          type: 'success',
          title: 'Vale-presente criado com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação do vale-presente',
          description:
            'Ocorreu um erro ao criar o vale-presente, tente novamente.',
        });
      }
    },
    [addToast, giftCards, toggleAddModal, validateForm],
  );

  const handleEditGiftCard = useCallback(
    async (data: IGiftCardData) => {
      setEditingGiftCard(data);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const editGiftCard = useCallback(
    async (data: IGiftCardData) => {
      try {
        await validateForm(data);

        const response = await api.put<IGiftCardData>(
          `/gift-cards/${editingGiftCard.id}`,
          {
            title: data.title,
            image_url: data.image_url,
            points: data.points,
            units_available: data.units_available,
            expiration_days: data.expiration_days,
            description: data.description,
          },
        );

        const updatedGiftCards = giftCards.map((g) =>
          g.id === editingGiftCard.id ? response.data : g,
        );
        setGiftCards(updatedGiftCards);
        toggleEditModal();
        addToast({
          type: 'success',
          title: 'Vale-presente editado com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na edição do vale-presente',
          description:
            'Ocorreu um erro ao editar o vale-presente, tente novamente.',
        });
      }
    },
    [addToast, giftCards, editingGiftCard.id, toggleEditModal, validateForm],
  );

  const handleDeleteGiftCard = useCallback(
    async (id: string) => {
      try {
        await api.delete<IGiftCardData>(`/gift-cards/${id}`);
        const updatedGiftCards = giftCards.filter((c) => c.id !== id);
        setGiftCards(updatedGiftCards);
        addToast({
          type: 'success',
          title: 'Vale-presente excluído com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao deletar vale-presente',
          description:
            'Ocorreu um erro ao deletar o vale-presente, tente novamente.',
        });
      }
    },
    [addToast, giftCards],
  );

  return (
    <>
      <Header />
      <Modal isOpen={modalStatusNewGiftCard} toggleModal={toggleAddModal}>
        <Form ref={formRef} onSubmit={handleAddGiftCard}>
          <h2>Novo Vale-Presente</h2>
          <br />
          <Input name="title" label="Título" />
          <Input name="image_url" label="Link da imagem" />
          <Input
            type="number"
            name="points"
            label="Quantidade de pontos"
            defaultValue={0}
          />
          <Input
            type="number"
            name="units_available"
            label="Unidades disponíveis"
            defaultValue={0}
          />
          <Input
            type="number"
            name="expiration_days"
            label="Quantidade de dias de validade"
            defaultValue={0}
          />
          <TextArea
            name="description"
            label="Política de resgate do vale-presente"
          />

          <Button light onClick={() => toggleAddModal()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal isOpen={modalStatusEditGiftCard} toggleModal={toggleEditModal}>
        <Form ref={formRef} onSubmit={editGiftCard}>
          <h2>Editar Vale-presente</h2>
          <br />
          <Input
            name="title"
            label="Título"
            defaultValue={editingGiftCard.title}
          />
          <Input
            name="image_url"
            label="Link da imagem"
            defaultValue={editingGiftCard.image_url}
          />
          <Input
            type="number"
            name="points"
            label="Quantidade de pontos"
            defaultValue={editingGiftCard.points}
          />
          <Input
            type="number"
            name="units_available"
            label="Unidades disponíveis"
            defaultValue={editingGiftCard.units_available}
          />
          <Input
            type="number"
            name="expiration_days"
            label="Quantidade de dias de validade"
            defaultValue={editingGiftCard.expiration_days}
          />
          <TextArea
            name="description"
            label="Política de resgate do vale-presente"
            defaultValue={editingGiftCard.description}
          />

          <Button light onClick={() => toggleEditModal()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Container>
        <h3>Vale-presente</h3>
        <Content>
          <AddGiftCard onClick={toggleAddModal}>
            <FiPlus />
            <span>Novo vale-presente</span>
          </AddGiftCard>

          {giftCards &&
            giftCards.map((giftCard) => (
              <GiftCard key={giftCard.id}>
                <span>{giftCard.title}</span>
                <img src={giftCard.image_url} alt="Imagem do vale-presente" />
                <div>
                  <Button light onClick={() => handleEditGiftCard(giftCard)}>
                    <FiEdit />
                    Editar
                  </Button>
                  <Button
                    light
                    onClick={() => handleDeleteGiftCard(giftCard.id)}
                  >
                    <FiTrash />
                    Excluir
                  </Button>
                </div>
              </GiftCard>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminGiftCards;
