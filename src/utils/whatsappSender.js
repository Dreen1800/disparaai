// src/utils/whatsappSender.js
/**
 * Envia uma mensagem de WhatsApp usando o serviço apropriado
 */
export async function sendWhatsAppMessage(connectionType, instance, phoneNumber, content) {
  // Implementação de exemplo - você deve substituir por suas integrações reais
  
  // Normalizar o número de telefone (remover espaços, traços, etc.)
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  
  switch (connectionType) {
    case 'official':
      return sendViaOfficialApi(instance, normalizedPhone, content);
    case 'unofficial':
      return sendViaUnofficialApi(instance, normalizedPhone, content);
    case 'evolution':
      return sendViaEvolutionApi(instance, normalizedPhone, content);
    default:
      throw new Error(`Unsupported connection type: ${connectionType}`);
  }
}

/**
 * Normaliza um número de telefone
 */
function normalizePhoneNumber(phone) {
  // Remover todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Garantir que tem o prefixo do país (55 para Brasil)
  if (numbers.length <= 10) {
    throw new Error('Invalid phone number format');
  }
  
  if (numbers.startsWith('55')) {
    return numbers;
  }
  
  // Adicionar 55 se não tiver
  return `55${numbers}`;
}

/**
 * Enviar via API Oficial (Meta Cloud API)
 */
async function sendViaOfficialApi(instance, phoneNumber, content) {
  try {
    const { credentials } = instance.whatsapp_connections;
    
    if (!credentials || !credentials.phoneNumberId || !credentials.accessToken) {
      throw new Error('Missing API credentials');
    }
    
    // Construir payload da mensagem
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: content
      }
    };
    
    // Enviar requisição para a API
    const response = await fetch(`https://graph.facebook.com/v17.0/${credentials.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WhatsApp API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error sending via Official API:', error);
    throw error;
  }
}

/**
 * Enviar via API Não Oficial
 */
async function sendViaUnofficialApi(instance, phoneNumber, content) {
  // Implementação da API não oficial
  console.log(`[MOCK] Sending via Unofficial API: To=${phoneNumber}, Content=${content}`);
  
  // Simular sucesso
  return {
    success: true,
    messageId: `mock_${Date.now()}`
  };
}

/**
 * Enviar via Evolution API
 */
async function sendViaEvolutionApi(instance, phoneNumber, content) {
  try {
    const { credentials } = instance.whatsapp_connections;
    
    if (!credentials || !credentials.apiUrl || !credentials.apiKey) {
      throw new Error('Missing Evolution API credentials');
    }
    
    // Construir payload da mensagem
    const payload = {
      number: phoneNumber,
      text: content,
      delay: 1000 // 1 segundo de atraso para evitar bloqueios
    };
    
    // Enviar requisição para a API
    const response = await fetch(`${credentials.apiUrl}/message/sendText/${instance.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': credentials.apiKey
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Evolution API error: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error sending via Evolution API:', error);
    throw error;
  }
}
