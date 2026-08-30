import AsyncStorage from '@react-native-async-storage/async-storage';

// Durações em minutos
export const CONFIG_PADRAO = {
  foco: 25,
  pausaCurta: 5,
  pausaLonga: 15,
  focosAtePausaLonga: 4,
};

const chaveSessoes = (email) => `cuco_sessoes_${email}`;
const CHAVE_CONFIG = 'cuco_config';

export async function buscarSessoes(email) {
  try {
    const dados = await AsyncStorage.getItem(chaveSessoes(email));
    return dados ? JSON.parse(dados) : [];
  } catch (e) {
    console.error('Erro ao buscar sessões:', e);
    return [];
  }
}

export async function salvarSessao(email, sessao) {
  try {
    const sessoes = await buscarSessoes(email);
    sessoes.unshift(sessao); // mais recente primeiro
    await AsyncStorage.setItem(chaveSessoes(email), JSON.stringify(sessoes));
    return sessoes;
  } catch (e) {
    console.error('Erro ao salvar sessão:', e);
    return [];
  }
}

export async function buscarConfig() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_CONFIG);
    return dados ? { ...CONFIG_PADRAO, ...JSON.parse(dados) } : CONFIG_PADRAO;
  } catch (e) {
    console.error('Erro ao buscar config:', e);
    return CONFIG_PADRAO;
  }
}

export async function salvarConfig(config) {
  try {
    await AsyncStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Erro ao salvar config:', e);
  }
}