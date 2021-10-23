import React, { useState, useEffect } from 'react';

import Header from '~/components/Header';

import { Container, Content, ChartContainer } from './styles';
import api from '~/services/api';
import { parseISO, format } from 'date-fns';
import {
  Bar,
  BarChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  LabelList,
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
            <ResponsiveContainer width={'99%'} height={300}>
              <BarChart
                data={summary.lastRequests}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <h3>Vales-presente resgatados nos últimos 30 dias</h3>
                {/* <XAxis dataKey="title" /> */}
                <YAxis width={20} />
                <Tooltip />
                <Bar
                  name="Quantidade de vales-presente"
                  allowReorder="yes"
                  dataKey="count"
                  fill="#b987e1"
                >
                  <LabelList dataKey="title" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <br />

          <ChartContainer>
            <h3>Resgates semanais</h3>
            <ResponsiveContainer width={'99%'} height={300}>
              <LineChart
                data={summary.weeklyRequests}
                margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <XAxis dataKey="week_date_formatted" />
                <YAxis width={20} />
                <Tooltip />
                <Legend />
                <Line
                  name="Quantidade na semana"
                  type="monotone"
                  dataKey="count"
                  stroke="#b987e1"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <br />

          <ChartContainer>
            <h3>Validações semanais</h3>
            <ResponsiveContainer width={'99%'} height={300}>
              <LineChart
                data={summary.weeklyValidations}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis dataKey="week_date_formatted" />
                <YAxis width={20} />
                <Tooltip />
                <Legend />
                <Line
                  name="Quantidade na semana"
                  type="monotone"
                  dataKey="count"
                  stroke="#b987e1"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Content>
      </Container>
    </>
  );
};

export default GiftCardsSummary;
