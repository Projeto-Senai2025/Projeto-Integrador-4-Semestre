import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";
import styles from "./ReportGenerator.module.css";
 
const ReportGenerator = () => {
  // Estado dos filtros de data e tipo de relatório
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("temperature");
 
  // Estado para os dados do relatório
  const [data, setData] = useState([]);
 
  // Função para buscar dados da API com base nos filtros
  const fetchData = async () => {
    try {
      let endpoint = "";
 
      // Determina o endpoint com base no tipo de relatório selecionado
      switch (reportType) {
        case "temperature":
          endpoint = "http://localhost:5271/api/Temperatura";
          break;
        case "humidity":
          endpoint = "http://localhost:5271/api/Umidade";
          break;
        case "soil":
          endpoint = "http://localhost:5271/api/UmidadeTerra";
          break;
        default:
          return;
      }
 
      // Faz a requisição para a API
      const response = await axios.get(endpoint);
 
      // Ajusta as datas para incluir corretamente o dia atual
      const filteredData = response.data.filter((item) => {
        const itemDate = new Date(item.ultimaMedicao); // Data do item recebido
        const start = new Date(startDate); // Data de início
        const end = new Date(endDate); // Data de fim
 
        // Zera as horas de startDate e endDate para garantir comparação de apenas data
        start.setHours(0, 0, 0, 0); // Ajusta startDate para o início do dia
        end.setHours(23, 59, 59, 999); // Ajusta endDate para o final do dia
 
        // Converte as datas para o formato YYYY-MM-DD para comparar as datas (sem considerar hora)
        const itemDateString = itemDate.toISOString().split('T')[0]; // Ano-mês-dia
        const startDateString = start.toISOString().split('T')[0]; // Ano-mês-dia
        const endDateString = end.toISOString().split('T')[0]; // Ano-mês-dia
 
        // Verifica se a data do item está dentro do intervalo
        return itemDateString >= startDateString && itemDateString <= endDateString;
      });
 
      // Mapeia os dados para o formato necessário
      setData(
        filteredData.map((item) => ({
          date: new Date(item.ultimaMedicao).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          value:
            reportType === "temperature"
              ? item.temperaturaAtual
              : reportType === "humidity"
              ? item.umidadeAtual
              : item.umidadeTerraAtual,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setData([]); // Limpa os dados em caso de erro
    }
  };
 
  // Atualiza os dados sempre que os filtros mudam
  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, reportType]);
 
  // Função para gerar um relatório em PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Dados da Estufa Inteligente", 10, 10);
    doc.text(
      `Tipo de Relatório: ${
        reportType === "temperature"
          ? "Temperatura"
          : reportType === "humidity"
          ? "Umidade do Ar"
          : "Umidade do Solo"
      }`,
      10,
      20
    );
    doc.text(`Data de Início: ${startDate.split("-").reverse().join("/")}`, 10, 30);
    doc.text(`Data de Fim: ${endDate.split("-").reverse().join("/")}`, 10, 40);
 
    // Adiciona os dados ao PDF
    if (data.length > 0) {
      data.forEach((item, index) => {
        doc.text(
          `${item.date} ${item.value} ${
            reportType === "temperature" ? "°C" : "%"
          }`,
          10,
          50 + index * 10
        );
      });
    } else {
      doc.text("Nenhum dado disponível para o período selecionado.", 10, 50);
    }
 
    // Salva o PDF gerado
    doc.save(`Relatorio_${reportType}.pdf`);
  };
 
  return (
    <div className={styles.container}>
      <h2>Gerar Relatório</h2>
 
      {/* Filtros de Data e Tipo de Relatório */}
      <div className={styles.filters}>
        <div className={styles.filter}>
          <label>Data de Início:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
 
        <div className={styles.filter}>
          <label>Data de Fim:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
 
        <div className={styles.filter}>
          <label>Tipo de Relatório:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="temperature">Temperatura</option>
            <option value="humidity">Umidade do Ar</option>
            <option value="soil">Umidade do Solo</option>
          </select>
        </div>
      </div>
 
      {/* Pré-visualização dos Dados */}
      <div className={styles.dataPreview}>
        <h3>
          Dados de{" "}
          {reportType === "temperature"
            ? "Temperatura"
            : reportType === "humidity"
            ? "Umidade do Ar"
            : "Umidade do Solo"}
        </h3>
        <ul>
          {data.length > 0 ? (
            data.map((item, index) => (
              <li key={index}>
                {item.date} {item.value}{" "}
                {reportType === "temperature" ? "°C" : "%"}
              </li>
            ))
          ) : (
            <li>Selecione o campo de data início e fim e o tipo de relatório.</li>
          )}
        </ul>
      </div>
 
      {/* Botão para Download do PDF */}
      <button className={styles.downloadButton} onClick={generatePDF}>
        Baixar Relatório
      </button>
    </div>
  );
};
 
export default ReportGenerator;