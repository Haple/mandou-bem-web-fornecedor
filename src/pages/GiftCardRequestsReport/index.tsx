import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiDownload, FiSearch } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { format, parseISO } from 'date-fns';

import Header from '~/components/Header';
import ComboBox from '~/components/ComboBox';
import DateInput from '~/components/DateInput';

import {
  Container,
  Content,
  SearchOptions,
  RewardRequestsContainer,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Loading from '~/components/Loading';
import { useToast } from '~/hooks/toast';

interface IPagination<T> {
  total: number;
  result: T[];
}

interface IRewardRequest {
  id: string;
  created_at: string;
  user_name: string;
  reward_title: string;
  status: 'pending_approval' | 'use_available' | 'used' | 'reproved';
  status_formatted: string;
}

interface IGiftCardData {
  id: string;
  title: string;
}

const GiftCardRequestsReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [giftCards, setGiftCards] = useState<IGiftCardData[]>([]);
  const [rewardRequests, setRewardRequests] = useState<IRewardRequest[]>([]);
  const [page, setPage] = useState(0);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  /**
   * Load gift cards
   */
  useEffect(() => {
    async function loadGiftCards(): Promise<void> {
      const response = await api.get<IGiftCardData[]>('gift-cards');
      setGiftCards(response.data);
    }
    loadGiftCards();
  }, []);

  const getRewardRequests = useCallback(async (page?: number): Promise<
    IRewardRequest[]
  > => {
    const start_date =
      formRef.current?.getFieldValue('start_date') || '2000-01-01';
    const end_date =
      formRef.current?.getFieldValue('end_date') || new Date().toISOString();
    const gift_card_id =
      formRef?.current?.getFieldValue('gift_card_id') || null;
    const status = formRef?.current?.getFieldValue('status');

    const response = await api.get<IPagination<IRewardRequest>>(
      `giftcard-requests-report`,
      {
        params: {
          page: page || 0,
          size: 10,
          start_date,
          end_date,
          gift_card_id: gift_card_id === 'all' ? null : gift_card_id,
          status: status === 'all' ? null : status,
        },
      },
    );

    const status_format = {
      pending_approval: 'Pendente de aprovação',
      use_available: 'Disponível para utilização',
      used: 'Utilizado',
      reproved: 'Recusado',
    };

    const answers = response.data.result.map((answer) => ({
      ...answer,
      created_at: format(parseISO(answer.created_at), 'dd/MM/yyyy'),
      status_formatted: status_format[answer.status],
    }));

    return answers;
  }, []);

  const handleGetRewardRequests = useCallback(async () => {
    try {
      const reward_requests = await getRewardRequests(0);
      setPage(0);
      setRewardRequests(reward_requests);

      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao consultar os resgates de vales-presente',
        description:
          'Ocorreu um erro ao consultar os resgates de vales-presente, tente novamente.',
      });
      setLoading(false);
    }
  }, [addToast, getRewardRequests]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      const start_date =
        formRef.current?.getFieldValue('start_date') || '2000-01-01';
      const end_date =
        formRef.current?.getFieldValue('end_date') || new Date().toISOString();
      const gift_card_id =
        formRef?.current?.getFieldValue('gift_card_id') || null;
      const status = formRef?.current?.getFieldValue('status');

      const { data } = await api.get(`giftcard-requests-report/pdf`, {
        params: {
          start_date,
          end_date,
          gift_card_id: gift_card_id === 'all' ? null : gift_card_id,
          status: status === 'all' ? null : status,
        },
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
      });
      const blob = new Blob([data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `resgates-de-vales-presente-${new Date().getTime()}.pdf`;
      link.click();
      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao baixar PDF de resgates dos vales-presente',
        description:
          'Ocorreu um erro ao baixar o PDF dos resgates dos vales-presente, tente novamente.',
      });
    }
  }, [addToast]);

  const handleScroll = useCallback(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;

    const answers = await getRewardRequests(page + 1);
    setRewardRequests([...rewardRequests, ...answers]);
    setPage(page + 1);
  }, [rewardRequests, getRewardRequests, page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Loading loading={loading} />
      <Header />

      <Container>
        <h2>Relatório de Resgates de Vales-Presente</h2>
        <br />
        <Content>
          <SearchOptions>
            <Form ref={formRef} onSubmit={() => setLoading(true)}>
              <div>
                <DateInput name="start_date" label="Data inicial" />
                <DateInput name="end_date" label="Data final" />
                <ComboBox name="status" label="Status">
                  <option selected value="all">
                    Todos
                  </option>
                  <option value="use_available">
                    Disponível para utilização
                  </option>
                  <option value="used">Utilizado</option>
                </ComboBox>
              </div>

              <div>
                <ComboBox name="gift_card_id" label="Vale-presente">
                  <option selected value="all">
                    Todos
                  </option>
                  {giftCards &&
                    giftCards.map((giftCard) => (
                      <option value={giftCard.id} key={giftCard.id}>
                        {giftCard.title}
                      </option>
                    ))}
                </ComboBox>
              </div>

              <div className="actions">
                <Button
                  type="submit"
                  light
                  onClick={() => handleGetRewardRequests()}
                >
                  <FiSearch />
                  Consultar
                </Button>
                <Button type="submit" light onClick={() => handleDownloadPDF()}>
                  <FiDownload />
                  Baixar PDF
                </Button>
              </div>
            </Form>
          </SearchOptions>
          <br />
          <RewardRequestsContainer>
            <table>
              <thead>
                <th>Código</th>
                <th>Data</th>
                <th>Nome</th>
                <th>Vale-presente</th>
                <th>Status</th>
              </thead>
              <tbody>
                {rewardRequests &&
                  rewardRequests.map((rewardRequest) => (
                    <tr key={rewardRequest.id}>
                      <td>{rewardRequest.id}</td>
                      <td>{rewardRequest.created_at}</td>
                      <td>{rewardRequest.user_name}</td>
                      <td>{rewardRequest.reward_title}</td>
                      <td>{rewardRequest.status_formatted}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </RewardRequestsContainer>
        </Content>
      </Container>
    </>
  );
};

export default GiftCardRequestsReport;
