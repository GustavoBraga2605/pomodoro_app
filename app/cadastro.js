import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { cores, tipografia, espaco, raio } from '../theme';

/* ------------------------------------------------------------------ */
/* Marca — o relógio cuco: mostrador e ponteiros                       */
/* ------------------------------------------------------------------ */
function CucoMark({ size = 22, cor = cores.marProfundo, corPonteiros = cores.coral }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.2" stroke={cor} strokeWidth="1.5" />
      <Path
        d="M12 6.6V12l3.6 2.1"
        stroke={corPonteiros}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon({ open, cor = cores.tintaFraca }) {
  return open ? (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke={cor} strokeWidth="1.6" />
      <Circle cx="12" cy="12" r="3" stroke={cor} strokeWidth="1.6" />
    </Svg>
  ) : (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3l18 18M10.6 10.7a3 3 0 004.2 4.2M6.6 6.7C4 8.4 2 12 2 12s4 7 11 7c1.9 0 3.5-.5 4.9-1.2M17.4 17.3C19.7 15.7 22 12 22 12s-1.6-2.9-4.4-4.8"
        stroke={cor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12.5l5.5 5.5L20 7"
        stroke={cores.espuma}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Regras de senha — a lista acende conforme o usuário digita          */
/* ------------------------------------------------------------------ */
const REGRAS = [
  { chave: 'tamanho', rotulo: 'Mínimo de 8 caracteres', testar: (s) => s.length >= 8 },
  { chave: 'numero', rotulo: 'Pelo menos 1 número', testar: (s) => /\d/.test(s) },
  {
    chave: 'caixa',
    rotulo: 'Maiúscula e minúscula',
    testar: (s) => /[a-z]/.test(s) && /[A-Z]/.test(s),
  },
];

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */
export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmacao, setVerConfirmacao] = useState(false);
  const [aceitou, setAceitou] = useState(false);
  const [tentou, setTentou] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const { cadastrar } = useAuth();
  const router = useRouter();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const regrasOk = REGRAS.every((r) => r.testar(senha));
  const senhasBatem = confirmacao.length > 0 && senha === confirmacao;
  const formValido =
    nome.trim().length > 1 && emailValido && regrasOk && senhasBatem && aceitou;

  async function handleCadastro() {
    setTentou(true);
    if (!formValido) return;
    await cadastrar(nome.trim(), email.trim(), senha);
    setEnviado(true);
  }

  /* ---------------- Tela de sucesso ---------------- */
  if (enviado) {
    return (
      <View style={[estilos.pagina, estilos.paginaCentro]}>
        <View style={estilos.selo}>
          <CucoMark size={30} />
        </View>

        <Text style={[estilos.titulo, estilos.centro]}>O cuco já está no ninho</Text>
        <Text style={[estilos.subtitulo, estilos.centro]}>
          Conta criada para <Text style={estilos.destaque}>{email}</Text>. A partir de agora
          é ele quem anuncia a sua hora.
        </Text>

        <TouchableOpacity
          style={estilos.botaoPrimario}
          onPress={() => router.replace('/')}
          activeOpacity={0.85}
        >
          <Text style={estilos.textoBotaoPrimario}>Ir para o login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------------- Formulário ---------------- */
  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={estilos.pagina}
        keyboardShouldPersistTaps="handled"
      >
        <View style={estilos.marca}>
          <CucoMark size={22} />
          <Text style={estilos.marcaTexto}>CUCO</Text>
        </View>

        <View style={{ marginBottom: espaco.xs }}>
          <Text style={estilos.titulo}>Acerte seu relógio</Text>
          <Text style={estilos.subtitulo}>
            Crie sua conta e deixe o cuco marcar seus ciclos de foco a partir de hoje.
          </Text>
        </View>

        <View style={estilos.formulario}>
          <Campo rotulo="Nome">
            <TextInput
              style={estilos.entrada}
              value={nome}
              onChangeText={setNome}
              placeholder="Como podemos te chamar?"
              placeholderTextColor={cores.tintaFraca}
              autoCorrect={false}
            />
          </Campo>

          <Campo
            rotulo="E-mail"
            erro={tentou && email.length > 0 && !emailValido ? 'E-mail inválido' : null}
          >
            <TextInput
              style={estilos.entrada}
              value={email}
              onChangeText={setEmail}
              placeholder="voce@exemplo.com"
              placeholderTextColor={cores.tintaFraca}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Campo>

          <Campo rotulo="Senha">
            <View style={estilos.entradaComIcone}>
              <TextInput
                style={estilos.entradaInterna}
                value={senha}
                onChangeText={setSenha}
                placeholder="Crie uma senha"
                placeholderTextColor={cores.tintaFraca}
                secureTextEntry={!verSenha}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={estilos.botaoOlho}
                onPress={() => setVerSenha((v) => !v)}
                accessibilityLabel={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <EyeIcon open={verSenha} />
              </TouchableOpacity>
            </View>

            {senha.length > 0 && (
              <View style={estilos.listaRegras}>
                {REGRAS.map((r) => {
                  const ok = r.testar(senha);
                  return (
                    <View key={r.chave} style={estilos.itemRegra}>
                      <View style={[estilos.pontoRegra, ok && estilos.pontoRegraOk]} />
                      <Text style={[estilos.textoRegra, ok && estilos.textoRegraOk]}>
                        {r.rotulo}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </Campo>

          <Campo
            rotulo="Confirmar senha"
            erro={
              tentou && confirmacao.length > 0 && !senhasBatem
                ? 'As senhas não coincidem'
                : null
            }
          >
            <View style={estilos.entradaComIcone}>
              <TextInput
                style={estilos.entradaInterna}
                value={confirmacao}
                onChangeText={setConfirmacao}
                placeholder="Repita a senha"
                placeholderTextColor={cores.tintaFraca}
                secureTextEntry={!verConfirmacao}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={estilos.botaoOlho}
                onPress={() => setVerConfirmacao((v) => !v)}
                accessibilityLabel={verConfirmacao ? 'Ocultar senha' : 'Mostrar senha'}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <EyeIcon open={verConfirmacao} />
              </TouchableOpacity>
            </View>
          </Campo>

          <TouchableOpacity
            style={estilos.linhaCheckbox}
            onPress={() => setAceitou((a) => !a)}
            activeOpacity={0.7}
          >
            <View style={[estilos.checkbox, aceitou && estilos.checkboxMarcado]}>
              {aceitou && <CheckIcon />}
            </View>
            <Text style={estilos.textoCheckbox}>
              Aceito os <Text style={estilos.linkInline}>termos de uso</Text> e a{' '}
              <Text style={estilos.linkInline}>política de privacidade</Text>
            </Text>
          </TouchableOpacity>

          {tentou && !formValido && (
            <Text style={estilos.erroFormulario}>
              Revise os campos destacados antes de continuar.
            </Text>
          )}

          <TouchableOpacity
            style={estilos.botaoPrimario}
            onPress={handleCadastro}
            activeOpacity={0.85}
          >
            <Text style={estilos.textoBotaoPrimario}>Criar minha conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/')} activeOpacity={0.7}>
          <Text style={estilos.rodape}>
            Já tem uma conta? <Text style={estilos.link}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ rotulo, children, erro }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotuloCampo}>{rotulo}</Text>
      {children}
      {erro && <Text style={estilos.erroCampo}>{erro}</Text>}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Estilos                                                             */
/* ------------------------------------------------------------------ */
const estilos = StyleSheet.create({
  flex: { flex: 1, backgroundColor: cores.areia },
  pagina: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: cores.areia,
    padding: espaco.lg,
    gap: espaco.lg,
  },
  paginaCentro: { flex: 1, alignItems: 'center', gap: espaco.lg },
  centro: { textAlign: 'center' },

  marca: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  marcaTexto: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 3,
    color: cores.marProfundo,
  },

  titulo: { ...tipografia.titulo, color: cores.tinta, marginBottom: espaco.xs + 2 },
  subtitulo: {
    ...tipografia.legenda,
    fontSize: 13.5,
    lineHeight: 20, // em RN é pixel, não multiplicador
    color: cores.tintaFraca,
  },
  destaque: { color: cores.marProfundo, fontWeight: '700' },

  formulario: { gap: espaco.md },
  campo: { gap: espaco.xs + 2 },
  rotuloCampo: {
    ...tipografia.rotulo,
    fontSize: 11.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: cores.tintaFraca,
  },

  entrada: {
    backgroundColor: cores.espuma,
    borderWidth: 1,
    borderColor: cores.linha,
    borderRadius: raio.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: cores.tinta,
  },
  entradaComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.espuma,
    borderWidth: 1,
    borderColor: cores.linha,
    borderRadius: raio.md,
    paddingRight: 12,
  },
  entradaInterna: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: cores.tinta,
  },
  botaoOlho: { padding: espaco.xs },

  listaRegras: { marginTop: espaco.xs, gap: espaco.xs },
  itemRegra: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  pontoRegra: {
    width: 5,
    height: 5,
    borderRadius: raio.pilula,
    backgroundColor: cores.linha,
  },
  pontoRegraOk: { backgroundColor: cores.aguaRasa },
  textoRegra: { fontSize: 11.5, color: cores.tintaFraca },
  textoRegraOk: { color: cores.aguaRasa },

  erroCampo: { fontSize: 11.5, color: cores.erro },
  erroFormulario: { fontSize: 12, color: cores.erro },

  linhaCheckbox: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.sm + 2 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: raio.sm - 2,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.espuma,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxMarcado: { backgroundColor: cores.coral, borderColor: cores.coral },
  textoCheckbox: { flex: 1, fontSize: 12.5, lineHeight: 19, color: cores.tintaFraca },
  linkInline: { color: cores.coral, fontWeight: '600' },

  botaoPrimario: {
    backgroundColor: cores.coral,
    borderRadius: raio.pilula,
    paddingVertical: 14,
    paddingHorizontal: espaco.lg,
    alignItems: 'center',
    marginTop: espaco.xs,
    // sombra: iOS usa shadow*, Android usa elevation
    shadowColor: cores.coral,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  textoBotaoPrimario: { color: cores.espuma, fontSize: 15, fontWeight: '700' },

  selo: {
    width: 60,
    height: 60,
    borderRadius: raio.pilula,
    backgroundColor: cores.espuma,
    borderWidth: 1,
    borderColor: cores.linha,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rodape: { textAlign: 'center', fontSize: 12.5, color: cores.tintaFraca },
  link: { color: cores.coral, fontWeight: '600' },
});