
export const cores = {
  areia:        '#FDF6EC', 
  espuma:       '#FFFFFF', 
  marProfundo:  '#0F5C5C', 
  aguaRasa:     '#2BB3A3', 
  coral:        '#FF7A59', 
  sol:          '#FFC24B', 
  tinta:        '#14262B', 
  tintaFraca:   '#6B8288', 
  linha:        '#E7DED0', 
  erro:         '#E2574C',
};

export const corDaFase = {
  foco:       cores.marProfundo,
  pausaCurta: cores.aguaRasa,
  pausaLonga: cores.coral,
};

export const rotuloDaFase = {
  foco:       'Foco',
  pausaCurta: 'Pausa curta',
  pausaLonga: 'Pausa longa',
};

export const tipografia = {
  cronometro: { fontSize: 72, fontWeight: '200', letterSpacing: -2, fontVariant: ['tabular-nums'] },
  marca:      { fontSize: 34, fontWeight: '800', letterSpacing: 6 },
  titulo:     { fontSize: 26, fontWeight: '700' },
  corpo:      { fontSize: 16, fontWeight: '400' },
  rotulo:     { fontSize: 13, fontWeight: '600', letterSpacing: 1.2 },
  legenda:    { fontSize: 12, fontWeight: '400' },
};

export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const raio  = { sm: 8, md: 12, lg: 20, pilula: 999 };