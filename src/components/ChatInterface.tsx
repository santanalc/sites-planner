import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileImage, Loader2, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import MarkdownContent from './MarkdownContent';
import ProgressBar from './ProgressBar';
import AudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';
import ImagePreview from './ImagePreview';
import { usePersistence } from '@/hooks/usePersistence';
import { extractUserName, extractWhatsApp, extractDataFromConversation } from '@/utils/dataExtraction';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  files?: File[];
  audioBlob?: Blob;
}
interface ChatInterfaceProps {
  onDataCollected: (data: any) => void;
}
interface CollectedData {
  session_id: string;
  user_name?: string;
  user_whatsapp?: string;
  company_name?: string;
  slogan?: string;
  mission?: string;
  vision?: string;
  values?: string;
  description?: string;
  differentials?: string;
  products_services?: string;
  target_audience?: string;
  social_proof?: string;
  design_preferences?: string;
  contact_info?: string;
  website_objective?: string;
  additional_info?: string;
  uploaded_files?: string[];
  conversation_log: any[];
  status: 'in_progress' | 'completed';
  created_at: string;
}
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onDataCollected
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<number>(0);
  const [evaluationComment, setEvaluationComment] = useState('');
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [collectedData, setCollectedData] = useState<Partial<CollectedData>>({
    session_id: sessionId,
    status: 'in_progress',
    created_at: new Date().toISOString(),
    conversation_log: [],
    uploaded_files: []
  });
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isLoading: persistenceLoading,
    persistedData,
    saveToStorage,
    clearStorage
  } = usePersistence(sessionId);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!persistenceLoading && !isInitialized) {
      if (persistedData && persistedData.messages && persistedData.messages.length > 1) {
        setMessages(persistedData.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setCollectedData(persistedData.collectedData || collectedData);
        setCurrentProgress(persistedData.currentProgress || 0);
        console.log('Sessão recuperada:', persistedData);
      } else {
        const initialMessage: Message = {
          id: '1',
          content: `Olá! Sou a assistente virtual da **Planner** e estou aqui para te ajudar a criar um site institucional incrível! 🚀

Vamos começar nossa conversa de forma natural. Para iniciar, preciso saber:

**Qual é o seu nome completo?** 😊`,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      }
      setIsInitialized(true);
    }
  }, [persistenceLoading, persistedData, isInitialized]);

  // Salvar progresso automaticamente
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      saveToStorage({
        sessionId,
        messages,
        collectedData,
        currentProgress
      });
    }
  }, [messages, collectedData, currentProgress, isInitialized]);

  // Sistema de prompt atualizado com nome Sophia e informações sobre logo e domínio
  const systemPrompt = `Você é Sophia, uma agente especializada da empresa "Planner", responsável por conduzir uma conversa acolhedora, natural e humanizada para coletar informações detalhadas sobre a empresa do cliente, visando o desenvolvimento de um site institucional onepage.

SOBRE A PLANNER:
A Planner é uma empresa de Gestão Inteligente de Negócios, especializada na análise e otimização de processos por meio de organização estratégica e soluções tecnológicas personalizadas. Unimos experiência prática em gestão com inovação digital, atuando de forma integrada nos setores público e privado.

O QUE FAZEMOS:
- Somos a melhor empresa em automatização de Funcionários Digitais com IA, atendimentos personalizados de SDR, Suporte Técnico, SAC, Secretária de Agendamentos
- Consultoria Estratégica: redesenho de processos operacionais e organizacionais com foco em eficiência e resultados
- Sistemas sob Medida: desenvolvimento de soluções low-code e aplicativos personalizados
- Gestão Pública: sistemas e serviços específicos para Secretarias de Educação, baseados em experiência real de gestão pública
- Treinamentos e Palestras: formação de equipes e capacitação de líderes em gestão e tecnologia
- Soluções Integradas: combinamos gestão, engenharia, jurídico, contábil e TI para entregar projetos completos

REGRA FUNDAMENTAL - INFORMAÇÕES OBRIGATÓRIAS PRIMEIRO:
- O PROCESSO SÓ DEVE INICIAR se o usuário fornecer NOME COMPLETO e NÚMERO DO WHATSAPP (com DDD)
- Se o usuário não fornecer essas informações essenciais, insista educadamente até obter ambos
- NÃO prossiga para outros tópicos até ter essas duas informações cruciais

CAMPOS OBRIGATÓRIOS QUE DEVEM SER COLETADOS (TODOS):
1. Nome completo e WhatsApp (OBRIGATÓRIO PRIMEIRO)
2. Nome da empresa e descrição do negócio
3. Missão da empresa
4. Visão da empresa  
5. Valores da empresa
6. Produtos/serviços oferecidos
7. Público-alvo e suas necessidades
8. Cases de sucesso e credibilidade (social_proof)
9. Preferências de design e estilo visual
10. **LOGOTIPO: Pergunte se a empresa já possui logotipo ou se precisa criar um**
11. **DOMÍNIO: Pergunte se já possui domínio registrado ou se precisa adquirir um**
12. Formas de contato e localização
13. Objetivo principal do site
14. Informações adicionais relevantes

ENCERRAMENTO DA CONVERSA:
- SÓ encerre a conversa quando TODOS os 14 campos acima tiverem sido coletados
- Antes de encerrar, verifique se alguma informação importante está faltando
- Só depois de ter TODAS as informações, pergunte sobre a avaliação

INSTRUÇÕES IMPORTANTES:
- Seja sempre empática, natural e conversacional
- Use linguagem casual mas profissional
- Use emojis moderadamente
- Sempre aguarde a resposta antes de fazer a próxima pergunta
- Confirme informações importantes de forma natural
- Se apresente como Sophia da Planner

FINALIZE APENAS com: "Perfeito! Consegui todas as informações que precisava. Agora gostaria de saber como foi nossa conversa para você. Pode avaliar nosso atendimento? ⭐"`;

  // Função melhorada para extrair e salvar dados
  const extractAndSaveData = async (content: string, existingData: Partial<CollectedData>, messages: Message[]): Promise<Partial<CollectedData>> => {
    const updatedData = { ...existingData };
    
    console.log('🔍 Extraindo dados da mensagem:', content);

    // Extrair nome do usuário
    if (!updatedData.user_name) {
      const name = extractUserName(content);
      if (name) {
        updatedData.user_name = name;
        console.log('✅ Nome extraído:', name);
      }
    }

    // Extrair WhatsApp
    if (!updatedData.user_whatsapp) {
      const whatsapp = extractWhatsApp(content);
      if (whatsapp) {
        updatedData.user_whatsapp = whatsapp;
        console.log('✅ WhatsApp extraído:', whatsapp);
      }
    }

    // Extrair dados usando a função do utils
    const extractedBriefingData = extractDataFromConversation([{
      role: 'user',
      content
    }]);

    // Mapear os dados extraídos
    if (extractedBriefingData.companyInfo.name && !updatedData.company_name) {
      updatedData.company_name = extractedBriefingData.companyInfo.name;
      console.log('✅ Nome da empresa extraído:', extractedBriefingData.companyInfo.name);
    }
    if (extractedBriefingData.companyInfo.description && !updatedData.description) {
      updatedData.description = extractedBriefingData.companyInfo.description;
      console.log('✅ Descrição extraída');
    }
    if (extractedBriefingData.companyInfo.mission && !updatedData.mission) {
      updatedData.mission = extractedBriefingData.companyInfo.mission;
      console.log('✅ Missão extraída');
    }
    if (extractedBriefingData.companyInfo.vision && !updatedData.vision) {
      updatedData.vision = extractedBriefingData.companyInfo.vision;
      console.log('✅ Visão extraída');
    }
    if (extractedBriefingData.companyInfo.values && !updatedData.values) {
      updatedData.values = extractedBriefingData.companyInfo.values;
      console.log('✅ Valores extraídos');
    }
    if (extractedBriefingData.companyInfo.slogan && !updatedData.slogan) {
      updatedData.slogan = extractedBriefingData.companyInfo.slogan;
      console.log('✅ Slogan extraído');
    }
    if (extractedBriefingData.productsServices.main && !updatedData.products_services) {
      updatedData.products_services = extractedBriefingData.productsServices.main;
      console.log('✅ Produtos/serviços extraídos');
    }
    if (extractedBriefingData.targetAudience.ideal && !updatedData.target_audience) {
      updatedData.target_audience = extractedBriefingData.targetAudience.ideal;
      console.log('✅ Público-alvo extraído');
    }
    if (extractedBriefingData.socialProof.clients && !updatedData.social_proof) {
      updatedData.social_proof = extractedBriefingData.socialProof.clients;
      console.log('✅ Prova social extraída');
    }
    if (extractedBriefingData.design.style && !updatedData.design_preferences) {
      updatedData.design_preferences = extractedBriefingData.design.style;
      console.log('✅ Preferências de design extraídas');
    }
    if (extractedBriefingData.contact.channels && !updatedData.contact_info) {
      updatedData.contact_info = extractedBriefingData.contact.channels;
      console.log('✅ Informações de contato extraídas');
    }
    if (extractedBriefingData.objectives.main && !updatedData.website_objective) {
      updatedData.website_objective = extractedBriefingData.objectives.main;
      console.log('✅ Objetivo do site extraído');
    }

    // Preparar histórico completo da conversa
    const historico = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
      files: msg.files?.map(f => f.name) || [],
      hasAudio: !!msg.audioBlob
    }));

    // Atualizar dados com histórico
    updatedData.historico_conversa = historico;
    updatedData.conversation_log = historico;

    console.log('💾 Dados atualizados para salvar:', {
      session_id: updatedData.session_id,
      user_name: updatedData.user_name,
      user_whatsapp: updatedData.user_whatsapp,
      company_name: updatedData.company_name,
      totalMessages: historico.length
    });

    // SALVAR IMEDIATAMENTE NO BANCO
    await saveDataToSupabase(updatedData);
    
    return updatedData;
  };

  // Calcular progresso baseado nos campos obrigatórios
  const calculateProgress = (data: Partial<CollectedData>): number => {
    const requiredFields = [
      'user_name', 'user_whatsapp', 'company_name', 'description', 
      'mission', 'vision', 'values', 'products_services', 
      'target_audience', 'social_proof', 'design_preferences', 
      'contact_info', 'website_objective', 'additional_info'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = data[field as keyof CollectedData];
      return value && String(value).trim() !== '';
    });
    
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    console.log(`📊 Progresso: ${filledFields.length}/${requiredFields.length} campos (${progress}%)`);
    console.log('✅ Campos preenchidos:', filledFields);
    console.log('❌ Campos faltando:', requiredFields.filter(f => !filledFields.includes(f)));
    
    return progress;
  };

  const uploadFilesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const fileName = `${sessionId}/${Date.now()}_${file.name}`;
      const {
        data,
        error
      } = await supabase.storage.from('client-files').upload(fileName, file);
      if (error) {
        console.error('Erro ao fazer upload:', error);
        continue;
      }
      const {
        data: urlData
      } = supabase.storage.from('client-files').getPublicUrl(fileName);
      uploadedUrls.push(urlData.publicUrl);
    }
    return uploadedUrls;
  };

  // Função melhorada para extrair dados das mensagens
  const extractDataFromMessage = (content: string, existingData: Partial<CollectedData>): Partial<CollectedData> => {
    const updatedData = {
      ...existingData
    };
    console.log('Extraindo dados da mensagem:', content);

    // Extrair nome do usuário
    if (!updatedData.user_name) {
      const name = extractUserName(content);
      if (name) {
        updatedData.user_name = name;
        console.log('Nome extraído:', name);
      }
    }

    // Extrair WhatsApp
    if (!updatedData.user_whatsapp) {
      const whatsapp = extractWhatsApp(content);
      if (whatsapp) {
        updatedData.user_whatsapp = whatsapp;
        console.log('WhatsApp extraído:', whatsapp);
      }
    }

    // Extrair dados usando a função do utils
    const extractedBriefingData = extractDataFromConversation([{
      role: 'user',
      content
    }]);

    // Mapear os dados extraídos para o formato do banco
    if (extractedBriefingData.companyInfo.name && !updatedData.company_name) {
      updatedData.company_name = extractedBriefingData.companyInfo.name;
    }
    if (extractedBriefingData.companyInfo.description && !updatedData.description) {
      updatedData.description = extractedBriefingData.companyInfo.description;
    }
    if (extractedBriefingData.companyInfo.mission && !updatedData.mission) {
      updatedData.mission = extractedBriefingData.companyInfo.mission;
    }
    if (extractedBriefingData.companyInfo.vision && !updatedData.vision) {
      updatedData.vision = extractedBriefingData.companyInfo.vision;
    }
    if (extractedBriefingData.companyInfo.values && !updatedData.values) {
      updatedData.values = extractedBriefingData.companyInfo.values;
    }
    if (extractedBriefingData.companyInfo.slogan && !updatedData.slogan) {
      updatedData.slogan = extractedBriefingData.companyInfo.slogan;
    }
    if (extractedBriefingData.productsServices.main && !updatedData.products_services) {
      updatedData.products_services = extractedBriefingData.productsServices.main;
    }
    if (extractedBriefingData.targetAudience.ideal && !updatedData.target_audience) {
      updatedData.target_audience = extractedBriefingData.targetAudience.ideal;
    }
    if (extractedBriefingData.socialProof.clients && !updatedData.social_proof) {
      updatedData.social_proof = extractedBriefingData.socialProof.clients;
    }
    if (extractedBriefingData.design.style && !updatedData.design_preferences) {
      updatedData.design_preferences = extractedBriefingData.design.style;
    }
    if (extractedBriefingData.contact.channels && !updatedData.contact_info) {
      updatedData.contact_info = extractedBriefingData.contact.channels;
    }
    if (extractedBriefingData.objectives.main && !updatedData.website_objective) {
      updatedData.website_objective = extractedBriefingData.objectives.main;
    }
    console.log('Dados atualizados:', updatedData);
    return updatedData;
  };
  const saveDataToSupabase = async (data: Partial<CollectedData>) => {
    try {
      console.log('Salvando dados no Supabase:', data);
      const {
        error
      } = await supabase.from('client_briefings').upsert({
        session_id: data.session_id,
        user_name: data.user_name,
        user_whatsapp: data.user_whatsapp,
        company_name: data.company_name,
        slogan: data.slogan,
        mission: data.mission,
        vision: data.vision,
        values: data.values,
        description: data.description,
        differentials: data.differentials,
        products_services: data.products_services,
        target_audience: data.target_audience,
        social_proof: data.social_proof,
        design_preferences: data.design_preferences,
        contact_info: data.contact_info,
        website_objective: data.website_objective,
        additional_info: data.additional_info,
        uploaded_files: data.uploaded_files,
        conversation_log: data.conversation_log,
        historico_conversa: data.historico_conversa,
        status: data.status,
        created_at: data.created_at,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
      } else {
        console.log('Dados salvos com sucesso no Supabase');
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
    }
  };
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const {
        data,
        error
      } = await supabase.functions.invoke('transcribe-audio', {
        body: {
          audio: base64Audio
        }
      });
      if (error) {
        throw new Error(error.message);
      }
      if (!data.success) {
        throw new Error(data.error || 'Erro na transcrição');
      }
      return data.text || '';
    } catch (error) {
      console.error('Erro na transcrição:', error);
      throw error;
    }
  };
  const handleAudioRecorded = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const transcribedText = await transcribeAudio(audioBlob);
      if (transcribedText.trim()) {
        await handleSendMessage(transcribedText, [], audioBlob);
      }
    } catch (error) {
      console.error('Erro ao processar áudio:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEvaluationSubmit = async () => {
    if (evaluation === 0) return;
    try {
      const finalMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `Muito obrigada pela sua avaliação${evaluation >= 4 ? ' excelente' : ''}! ${evaluationComment ? 'Suas sugestões são muito valiosas para nós. ' : ''}

🎉 **Briefing Finalizado com Sucesso!**

Nossa equipe da Planner entrará em contato em breve através do WhatsApp informado para dar continuidade ao desenvolvimento do seu site institucional.

Tenha um excelente dia! 🚀✨`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, finalMessage]);
      setIsEvaluating(false);
    } catch (error) {
      console.error('Erro ao processar avaliação:', error);
    }
  };
  const handleSendMessage = async (messageText?: string, messageFiles?: File[], audioBlob?: Blob) => {
    const textToSend = messageText || inputValue;
    const filesToSend = messageFiles || files;
    if (!textToSend.trim() && filesToSend.length === 0 && !audioBlob) return;
    let uploadedFileUrls: string[] = [];
    if (filesToSend.length > 0) {
      uploadedFileUrls = await uploadFilesToSupabase(filesToSend);
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: 'user',
      timestamp: new Date(),
      files: filesToSend.length > 0 ? [...filesToSend] : undefined,
      audioBlob: audioBlob
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // EXTRAIR E SALVAR DADOS IMEDIATAMENTE
    try {
      const extractedData = await extractAndSaveData(textToSend, collectedData, updatedMessages);
      
      // Atualizar dados coletados
      const updatedData = {
        ...extractedData,
        uploaded_files: [...(collectedData.uploaded_files || []), ...uploadedFileUrls]
      };
      
      setCollectedData(updatedData);

      // Calcular e atualizar progresso
      const newProgress = calculateProgress(updatedData);
      setCurrentProgress(newProgress);

    } catch (error) {
      console.error('❌ Erro crítico ao salvar dados:', error);
    }

    // Clear inputs
    setInputValue('');
    setFiles([]);
    setIsLoading(true);

    try {
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data: responseData, error } = await supabase.functions.invoke('chat-openai', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory
          ],
          sessionId: sessionId
        }
      });

      if (error) {
        throw new Error(`Erro na Edge Function: ${error.message}`);
      }

      if (!responseData.success) {
        throw new Error(responseData.error || 'Erro desconhecido');
      }

      const assistantResponse = responseData.message;
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Salvar histórico completo após resposta da IA
      const finalData = {
        ...collectedData,
        historico_conversa: finalMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
          files: msg.files?.map(f => f.name) || [],
          hasAudio: !!msg.audioBlob
        }))
      };

      await saveDataToSupabase(finalData);
      setCollectedData(finalData);

      // Verificar se chegou na avaliação
      if (assistantResponse.includes('avaliar nosso atendimento')) {
        setIsEvaluating(true);
      } else if (assistantResponse.includes('Nossa equipe da Planner entrará em contato')) {
        setIsCompleted(true);
        clearStorage();
        onDataCollected(finalData);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles]);
  };
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  if (persistenceLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Barra de Progresso - Apenas Desktop */}
      <div className="hidden md:block bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-3 md:p-4">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentProgress={currentProgress} isCompact={false} />
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 md:p-4 min-h-0 max-w-full">
        <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} max-w-full`}>
              <Card className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 break-words overflow-hidden ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="text-sm md:text-base leading-relaxed break-words">
                  {message.role === 'assistant' ? (
                    <MarkdownContent content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  )}
                </div>

                {message.files && message.files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.files.map((file, index) => (
                      <ImagePreview key={index} file={file} />
                    ))}
                  </div>
                )}

                {message.audioBlob && (
                  <div className="mt-3">
                    <AudioPlayer audioBlob={message.audioBlob} isUserMessage={message.role === 'user'} />
                  </div>
                )}

                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </Card>
            </div>
          ))}

          {/* Sistema de Avaliação */}
          {isEvaluating && (
            <div className="flex justify-start max-w-full">
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 max-w-[85%] md:max-w-[80%]">
                <h3 className="font-semibold text-gray-800 mb-3">Como foi nossa conversa?</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setEvaluation(star)}
                      className={`p-1 ${evaluation >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </Button>
                  ))}
                </div>
                <Input
                  placeholder="Deixe um comentário (opcional)"
                  value={evaluationComment}
                  onChange={(e) => setEvaluationComment(e.target.value)}
                  className="mb-3"
                />
                <Button
                  onClick={handleEvaluationSubmit}
                  disabled={evaluation === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  size="sm"
                >
                  Enviar Avaliação
                </Button>
              </Card>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="p-3 md:p-4 bg-gray-50">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Sophia está analisando suas informações...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {isCompleted && (
        <div className="p-3 md:p-4 bg-green-50 border-t border-green-200 flex-shrink-0">
          <div className="flex items-center gap-2 text-green-800 max-w-4xl mx-auto">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium text-sm md:text-base">
              Briefing finalizado! Dados salvos com sucesso (ID: {sessionId})
            </span>
          </div>
        </div>
      )}

      {/* Barra de envio - Largura fixa para mobile */}
      <div className="border-t bg-white p-3 md:p-4 relative z-10 flex-shrink-0 w-full max-w-full">
        <div className="max-w-4xl mx-auto w-full">
          {files.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <ImagePreview 
                  key={index} 
                  file={file} 
                  onRemove={() => removeFile(index)} 
                  showRemove={true} 
                />
              ))}
            </div>
          )}

          <div className="flex gap-2 w-full min-w-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 h-10 w-10"
              disabled={isCompleted || isEvaluating}
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
            
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isCompleted 
                  ? "Briefing finalizado" 
                  : isEvaluating 
                    ? "Aguardando avaliação..." 
                    : "Digite sua resposta..."
              }
              className="flex-1 text-sm md:text-base min-w-0"
              disabled={isLoading || isCompleted || isEvaluating}
            />
            
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || isCompleted || isEvaluating || (!inputValue.trim() && files.length === 0)}
              className="shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 w-10"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
