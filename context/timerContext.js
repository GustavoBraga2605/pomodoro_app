import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './AuthContext';
import { buscarConfig, salvarSessao, CONFIG_PADRAO } from '../storage/sessaoStorage';

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const { usuarioLogado } = useAuth();

  const [config, setConfig] = useState(CONFIG_PADRAO);
  const [fase, setFase] = useState('foco');
  const [restante, setRestante] = useState(CONFIG_PADRAO.foco * 60);
  const [ciclosDeFoco, setCiclosDeFoco] = useState(0);


  const [terminaEm, setTerminaEm] = useState(null);
  const rodando = terminaEm !== null;

  useEffect(() => {
    (async () => {
      const salva = await buscarConfig();
      setConfig(salva);
      setRestante(salva.foco * 60);
    })();
  }, []);

  const segundosRestantes = () =>
    Math.max(0, Math.round((terminaEm - Date.now()) / 1000));


  useEffect(() => {
    if (!terminaEm) return;
    const tick = () => {
      const segundos = segundosRestantes();
      setRestante(segundos);
      if (segundos === 0) concluirCiclo();
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [terminaEm, fase, ciclosDeFoco, config, usuarioLogado]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active' && terminaEm) setRestante(segundosRestantes());
    });
    return () => sub.remove();
  }, [terminaEm]);

  function duracaoDaFase(f) {
    return config[f] * 60;
  }

  function irParaFase(f) {
    setFase(f);
    setRestante(duracaoDaFase(f));
    setTerminaEm(null);
  }

  async function concluirCiclo() {
    setTerminaEm(null); // primeiro pra não concluir duas vezes

    if (fase !== 'foco') {
      irParaFase('foco');
      return;
    }

    const total = ciclosDeFoco + 1;
    setCiclosDeFoco(total);

    if (usuarioLogado?.email) {
      await salvarSessao(usuarioLogado.email, {
        id: String(Date.now()),
        minutos: config.foco,
        concluidaEm: new Date().toISOString(),
      });
    }

    const proxima =
      total % config.focosAtePausaLonga === 0 ? 'pausaLonga' : 'pausaCurta';
    irParaFase(proxima);
  }

  function iniciar() {
    if (restante <= 0) return;
    setTerminaEm(Date.now() + restante * 1000);
  }

  function pausar() {
    if (!terminaEm) return;
    setRestante(segundosRestantes());
    setTerminaEm(null);
  }

  function reiniciarFase() {
    irParaFase(fase);
  }

  function pular() {
    concluirCiclo();
  }

  // 0 a 1
  const progresso = 1 - restante / duracaoDaFase(fase);

  return (
    <TimerContext.Provider
      value={{
        fase, restante, rodando, ciclosDeFoco, progresso, config,
        iniciar, pausar, pular, reiniciarFase, setConfig,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}

export function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}