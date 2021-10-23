import React, { useState, useCallback, useRef } from 'react';

import { AiFillLike } from 'react-icons/ai';
import { FaQrcode, FaKeyboard } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import Header from '~/components/Header';
import Loading from '~/components/Loading';

import {
  Container,
  GiftCardRequest,
  ValidateGiftCardModal,
  GetGiftCardModal,
  GetGiftCardWithQRCodeModal,
  GiftCardRequestData,
} from './styles';
import Button from '~/components/Button';
import Input from '~/components/Input';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';
import Modal from '~/components/Modal';
import QRCodeReader from '~/components/QRCodeReader';
import drawSearching from '~/assets/draw-searching.svg';

interface IGiftCardRequest {
  id: string;
  user: {
    name: string;
  };
  gift_card: {
    title: string;
    points: number;
    description: string;
  };
  created_at: string;
  created_at_formatted: string;
  updated_at: string;
  updated_at_formatted: string;
  status: 'use_available' | 'used';
  status_formatted: string;
}

interface IGetGiftCardFormData {
  id: string;
}

const AdminValidateGiftCard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [
    modalStatusValidateGiftCard,
    setModalStatusValidateGiftCard,
  ] = useState(false);
  const [modalStatusGetGiftCard, setModalStatusGetGiftCard] = useState(false);
  const [
    modalStatusGetGiftCardWithQRCode,
    setModalStatusGetGiftCardWithQRCode,
  ] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [
    giftCardRequest,
    setGiftCardRequest,
  ] = useState<IGiftCardRequest | null>(null);

  const toggleValidateGiftCardModal = useCallback(() => {
    setModalStatusValidateGiftCard(!modalStatusValidateGiftCard);
  }, [modalStatusValidateGiftCard]);

  const toggleGetGiftCardModal = useCallback(() => {
    setModalStatusGetGiftCard(!modalStatusGetGiftCard);
  }, [modalStatusGetGiftCard]);

  const toggleGetGiftCardWithQRCodeModal = useCallback(() => {
    setModalStatusGetGiftCardWithQRCode(!modalStatusGetGiftCardWithQRCode);
  }, [modalStatusGetGiftCardWithQRCode]);

  const handleGetGiftCardRequest = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const { data } = await api.get<IGiftCardRequest>(
          `/gift-card-requests/${id}`,
        );

        const status_label = {
          use_available: 'Disponível para utilização',
          used: 'Utilizado',
        };

        const response_formmated = {
          ...data,
          created_at_formatted: format(
            parseISO(data.created_at),
            "dd/MM/yyyy 'às' HH:mm:ss",
          ),
          updated_at_formatted: format(
            parseISO(data.updated_at),
            "dd/MM/yyyy 'às' HH:mm:ss",
          ),
          status_formatted: status_label[data.status],
        };
        setGiftCardRequest(response_formmated);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao buscar vale-presente',
          description:
            'Ocorreu um erro ao buscar o vale-presente, tente novamente.',
        });
      }
      setLoading(false);
    },
    [addToast],
  );

  const handleValidateReward = useCallback(async () => {
    setLoading(true);
    try {
      await api.patch<IGiftCardRequest>(
        `/gift-card-requests/${giftCardRequest?.id}/validate`,
      );
      setGiftCardRequest(null);
      toggleValidateGiftCardModal();
      addToast({
        type: 'success',
        title: 'O vale-presente foi validado com sucesso',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao validar vale-presente',
        description:
          'Ocorreu um erro ao validar o vale-presente, tente novamente.',
      });
    }
    setLoading(false);
  }, [addToast, giftCardRequest, toggleValidateGiftCardModal]);

  const handleScan = useCallback(
    async (data: string | null) => {
      if (!data) {
        return;
      }
      await handleGetGiftCardRequest(data);
      toggleGetGiftCardWithQRCodeModal();
    },
    [handleGetGiftCardRequest, toggleGetGiftCardWithQRCodeModal],
  );

  const handleError = useCallback(
    async (err: any) => {
      addToast({
        type: 'error',
        title: 'Erro ao ler QR Code',
        description: 'Ocorreu um erro ao ler o QR Code, tente novamente.',
      });
    },
    [addToast],
  );

  const handleFormGetRewardRequest = useCallback(
    async (data: IGetGiftCardFormData) => {
      await handleGetGiftCardRequest(data.id);
      toggleGetGiftCardModal();
    },
    [handleGetGiftCardRequest, toggleGetGiftCardModal],
  );

  return (
    <>
      <Loading loading={loading} />
      <Header />

      <Modal
        isOpen={modalStatusValidateGiftCard}
        toggleModal={toggleValidateGiftCardModal}
      >
        <ValidateGiftCardModal>
          <Form ref={formRef} onSubmit={handleValidateReward}>
            <h2>Confirmar Entrega de Vale-Presente</h2>
            <br />
            <div>
              <span>
                Ao clicar em confirmar, esse vale-presente será considerado{' '}
                <b>utilizado</b>, ou seja, o colaborador recebeu a premiação.
                Tem certeza que deseja validar?
              </span>
            </div>
            <div>
              <Button light onClick={() => toggleValidateGiftCardModal()}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar</Button>
            </div>
          </Form>
        </ValidateGiftCardModal>
      </Modal>

      <Modal
        isOpen={modalStatusGetGiftCard}
        toggleModal={toggleGetGiftCardModal}
      >
        <GetGiftCardModal>
          <Form ref={formRef} onSubmit={handleFormGetRewardRequest}>
            <h2>Inserção Manual do Código de Resgate</h2>
            <br />
            <div>
              <Input name="id" label="Código do resgate" />
            </div>
            <div>
              <Button light onClick={() => toggleGetGiftCardModal()}>
                Cancelar
              </Button>
              <Button type="submit">Buscar</Button>
            </div>
          </Form>
        </GetGiftCardModal>
      </Modal>

      <Modal
        isOpen={modalStatusGetGiftCardWithQRCode}
        toggleModal={toggleGetGiftCardWithQRCodeModal}
      >
        <GetGiftCardWithQRCodeModal>
          <h2>Escanear QR Code</h2>
          <br />
          <h3>
            Exiba o QR Code no local indicado e o vale-presente será carregado
            automaticamente.
          </h3>
          <div>
            <QRCodeReader handleScan={handleScan} handleError={handleError} />
          </div>
          <div>
            <Button light onClick={() => toggleGetGiftCardWithQRCodeModal()}>
              Cancelar
            </Button>
          </div>
        </GetGiftCardWithQRCodeModal>
      </Modal>

      <Container>
        <h3>Validar utilização de vale-presente</h3>

        <GiftCardRequest>
          <div>
            <Button light onClick={toggleGetGiftCardWithQRCodeModal}>
              <FaQrcode />
              Escanear QR Code
            </Button>
            <Button light onClick={toggleGetGiftCardModal}>
              <FaKeyboard />
              Inserir código manualmente
            </Button>
          </div>
          {!giftCardRequest && (
            <img
              src={drawSearching}
              alt="Ilustração de uma mulher apontando uma luneta para um ponto de interrogação"
            />
          )}
          {giftCardRequest && (
            <GiftCardRequestData>
              <div>
                <span>
                  <label>Colaborador: </label>
                  {giftCardRequest.user.name}
                </span>
                <br />
                <span>
                  <label>Título: </label>
                  {giftCardRequest.gift_card.title}
                </span>
                <br />
                <span>
                  <label>Pontos: </label>
                  {giftCardRequest.gift_card.points}
                </span>
                <br />
                <span>
                  <label>Data do resgate: </label>
                  {giftCardRequest.created_at_formatted}
                </span>
                <br />
                <span>
                  <label>Data da última atualização: </label>
                  {giftCardRequest.updated_at_formatted}
                </span>
                <br />
                <span>
                  <label>Status: </label>
                  {giftCardRequest.status_formatted}
                </span>
                <br />
                <span>
                  <label>Política de resgate: </label>
                  {giftCardRequest.gift_card.description}
                </span>
              </div>
            </GiftCardRequestData>
          )}
          <Button
            light
            onClick={toggleValidateGiftCardModal}
            disabled={
              !giftCardRequest || giftCardRequest.status !== 'use_available'
            }
          >
            <AiFillLike />
            Validar vale-presente
          </Button>
        </GiftCardRequest>
      </Container>
    </>
  );
};

export default AdminValidateGiftCard;
