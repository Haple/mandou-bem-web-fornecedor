import React, { useState, useEffect } from 'react';

import Header from '~/components/Header';

import { Container, Content, ChartContainer } from './styles';
import api from '~/services/api';
import { parseISO, format } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Text,
  LineChart,
  Line,
} from 'recharts';

interface ISummaryData {
  weeklyRequests: {
    count: number;
    week_date: string;
    week_date_formatted: string;
  }[];
  weeklyValidations: {
    count: number;
    week_date: string;
    week_date_formatted: string;
  }[];
  lastRequests: {
    count: number;
    title: string;
  }[];
}

const GiftCardsSummary: React.FC = () => {
  const [summary, setSummary] = useState<ISummaryData>({} as ISummaryData);

  useEffect(() => {
    async function loadGiftCards(): Promise<void> {
      const { data } = await api.get<ISummaryData>(
        '/giftcard-requests-report/summary',
      );

      const weeklyRequests = data.weeklyRequests.map((item) => ({
        ...item,
        week_date_formatted: format(parseISO(item.week_date), 'dd/MM/yyyy'),
      }));

      const weeklyValidations = data.weeklyValidations.map((item) => ({
        ...item,
        week_date_formatted: format(parseISO(item.week_date), 'dd/MM/yyyy'),
      }));

      setSummary({
        weeklyRequests,
        weeklyValidations,
        lastRequests: data.lastRequests,
      });
    }

    loadGiftCards();
  }, []);

  return (
    <>
      <Header />

      <Container>
        <h2>Monitor de Vales-Presente</h2>
        <Content>
          <ChartContainer>
            <h3>Vales-presente resgatados nos últimos 30 dias</h3>

            <BarChart
              data={summary.lastRequests}
              width={1020}
              height={400}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                name="Quantidade de vales-presente"
                dataKey="count"
                fill="#b987e1"
              />
            </BarChart>
          </ChartContainer>
          <br />
          <ChartContainer>
            <h3>Resgates semanais</h3>
            <LineChart
              data={summary.weeklyRequests}
              width={1020}
              height={400}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="week_date_formatted" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                name="Quantidade na semana"
                type="monotone"
                dataKey="count"
                stroke="#b987e1"
              />
            </LineChart>
          </ChartContainer>
          <br />

          <ChartContainer>
            <h3>Validações semanais</h3>
            <LineChart
              data={summary.weeklyValidations}
              width={1020}
              height={400}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="week_date_formatted" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                name="Quantidade na semana"
                type="monotone"
                dataKey="count"
                stroke="#b987e1"
              />
            </LineChart>
          </ChartContainer>
        </Content>
      </Container>
    </>
  );
};

export default GiftCardsSummary;
