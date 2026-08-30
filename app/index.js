import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { cores, tipografia, espaco, raio } from '../theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha!');
      return;
    }
    const sucesso = await login(email.trim(), senha);
    if (sucesso) router.replace('/timer');
    else Alert.alert('Erro', 'E-mail ou senha incorretos!');
  }

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={estilos.container}>

        {/* espaço da logo*/}
        <View style={estilos.logo}>
          <Text style={estilos.logoTexto}>🐦</Text>
        </View>

        <Text style={estilos.marca}>CUCO</Text>
        <Text style={estilos.tagline}>Seus (quase) 30 minutos de produtividade do dia!</Text>

        <TextInput
          style={estilos.campo}
          placeholder="E-mail"
          placeholderTextColor={cores.tintaFraca}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={estilos.campo}
          placeholder="Senha"
          placeholderTextColor={cores.tintaFraca}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={estilos.botao} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')} activeOpacity={0.7}>
          <Text style={estilos.link}>Não tenho conta → Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1, backgroundColor: cores.areia },
  container: { flex: 1, justifyContent: 'center', padding: espaco.lg },

  logo: {
    width: 96, height: 96, borderRadius: raio.pilula,
    backgroundColor: cores.marProfundo,
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
    marginBottom: espaco.lg,
  },
  logoTexto: { fontSize: 44 },

  marca: { ...tipografia.marca, color: cores.marProfundo, textAlign: 'center' },
  tagline: {
    ...tipografia.legenda, color: cores.tintaFraca,
    textAlign: 'center', marginBottom: espaco.xxl,
  },

  campo: {
    backgroundColor: cores.espuma,
    borderWidth: 1, borderColor: cores.linha, borderRadius: raio.md,
    padding: espaco.md, marginBottom: espaco.sm + 4,
    fontSize: tipografia.corpo.fontSize, color: cores.tinta,
  },
  botao: {
    backgroundColor: cores.coral, padding: espaco.md,
    borderRadius: raio.md, alignItems: 'center', marginTop: espaco.sm,
  },
  textoBotao: { color: cores.espuma, fontWeight: 'bold', fontSize: 16 },
  link: {
    marginTop: espaco.lg, textAlign: 'center',
    color: cores.marProfundo, fontSize: 14,
  },
});