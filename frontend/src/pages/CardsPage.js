import React, { useState, useEffect } from 'react';
import DataCard from '../components/DataCard/DataCard';
import { FaThermometerHalf, FaTint, FaWater } from 'react-icons/fa';
import './AddSensor.css'; // CSS já usado antes

const CardsPage = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 25,
    airHumidity: 60,
    soilMoisture: 45,
  });

  const [showAddSensorForm, setShowAddSensorForm] = useState(false);
  const [customSensors, setCustomSensors] = useState([]);

  const [newSensor, setNewSensor] = useState({
    type: '',
    location: '',
    description: '',
    min: '',
    max: ''
  });

  useEffect(() => {
    const fetchSensorData = () => {
      const mockData = {
        temperature: Math.floor(Math.random() * 10) + 20,
        airHumidity: Math.floor(Math.random() * 50) + 50,
        soilMoisture: Math.floor(Math.random() * 40) + 30,
      };
      setSensorData(mockData);
    };
    fetchSensorData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSensor({ ...newSensor, [name]: value });
  };

  const handleSaveSensor = () => {
    if (!newSensor.type || !newSensor.location) {
      alert("Preencha pelo menos o Tipo e a Localização do sensor!");
      return;
    }

    setCustomSensors([...customSensors, newSensor]);

    alert("Sensor adicionado!");

    setNewSensor({ type: '', location: '', description: '', min: '', max: '' });
    setShowAddSensorForm(false);
  };

  // ---- NOVO: função para excluir sensor customizado ----
  const handleDeleteCustomSensor = (indexToDelete) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este sensor?');
    if (!confirmar) return;

    setCustomSensors(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Botão +Adicionar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <button className="add-sensor-button" onClick={() => setShowAddSensorForm(true)}>
          + Adicionar Sensor
        </button>
      </div>

      {/* Form */}
      {showAddSensorForm && (
        <div className="add-sensor-container">
          <h2>Adicionar Sensor</h2>

          <div className="sensor-type-buttons">
            {['Temperatura', 'Umidade do Ar', 'Umidade do Solo'].map((type) => (
              <button
                key={type}
                className={newSensor.type === type ? 'active' : ''}
                onClick={() => setNewSensor({ ...newSensor, type })}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            type="text"
            name="location"
            placeholder="Localização"
            value={newSensor.location}
            onChange={handleInputChange}
          />

          <textarea
            name="description"
            placeholder="Descrição do sensor"
            value={newSensor.description}
            onChange={handleInputChange}
          ></textarea>

          <div className="min-max-container">
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={newSensor.min}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={newSensor.max}
              onChange={handleInputChange}
            />
          </div>

          <div className="actions">
            <button className="cancel" onClick={() => setShowAddSensorForm(false)}>Cancelar</button>
            <button className="save" onClick={handleSaveSensor}>Salvar</button>
          </div>
        </div>
      )}

      {/* CARDS */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Cards padrão — sem onDelete (não podem ser removidos) */}
        <DataCard title="Temperatura" value={sensorData.temperature} unit="°C" icon={<FaThermometerHalf />} />
        <DataCard title="Umidade do Ar" value={sensorData.airHumidity} unit="%" icon={<FaTint />} />
        <DataCard title="Umidade de Solo" value={sensorData.soilMoisture} unit="%" icon={<FaWater />} />

        {/* Sensores adicionados pelo usuário — recebem onDelete */}
        {customSensors.map((sensor, index) => (
          <div key={index} className="new-sensor-card">
            <DataCard
              title={`${sensor.type} - ${sensor.location}`}
              value={sensor.min && sensor.max ? `${sensor.min} - ${sensor.max}` : '---'}
              unit=""
              icon={
                sensor.type === 'Temperatura' ? <FaThermometerHalf /> :
                sensor.type === 'Umidade do Ar' ? <FaTint /> :
                <FaWater />
              }
              onDelete={() => handleDeleteCustomSensor(index)} // <-- passa a função
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsPage;
