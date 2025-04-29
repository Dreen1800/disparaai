/**
 * Serviço para comunicação com a Evolution API
 * Baseado na documentação oficial: https://doc.evolution-api.com
 * 
 * Este serviço implementa os principais endpoints da Evolution API
 * para integração com WhatsApp através de conexão não oficial (Baileys)
 */

// Configurações da API
const DEFAULT_CONFIG = {
  baseUrl: 'https://evo.ariondigital.com.br/',
  apiKey: '429683C4C977415CAAFCCE10F7D57E11',
};

/**
 * Classe de serviço para operações com a Evolution API
 */
class EvolutionApiService {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Configura o cabeçalho para as requisições
   * @returns {Object} Cabeçalho de requisição com API key
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.config.apiKey
    };
  }

  /**
   * Verifica a conexão com a API
   * @returns {Promise<Object>} Informações da API
   */
  async checkConnection() {
    try {
      const response = await fetch(`${this.config.baseUrl}/`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao conectar com a Evolution API: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na conexão com Evolution API:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova instância na Evolution API
   * @param {Object} instanceData Dados da instância
   * @returns {Promise<Object>} Resultado da criação
   */
  async createInstance(instanceData) {
    const data = {
      instanceName: instanceData.name,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhookUrl: instanceData.webhookUrl || "",
      webhookByEvents: instanceData.webhookByEvents || false,
      events: instanceData.events || [
        "QRCODE_UPDATED",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "SEND_MESSAGE",
        "CONNECTION_UPDATE"
      ]
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/instance/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar instância: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar instância na Evolution API:', error);
      throw error;
    }
  }

  /**
   * Obtém o status de conexão de uma instância
   * @param {string} instanceName Nome da instância
   * @returns {Promise<Object>} Estado da conexão
   */
  async getConnectionState(instanceName) {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connectionState/${instanceName}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao obter estado da conexão: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter estado da conexão:', error);
      throw error;
    }
  }

  /**
   * Obtém o QR Code para conexão
   * @param {string} instanceName Nome da instância
   * @returns {Promise<Object>} QR Code da instância
   */
  async getQRCode(instanceName) {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connect/${instanceName}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao obter QR Code: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      throw error;
    }
  }

  /**
   * Configura o webhook para uma instância
   * @param {string} instanceName Nome da instância
   * @param {Object} webhookData Dados do webhook
   * @returns {Promise<Object>} Resultado da configuração
   */
  async setWebhook(instanceName, webhookData) {
    const data = {
      url: webhookData.url,
      webhook_by_events: webhookData.webhookByEvents || false,
      webhook_base64: webhookData.webhookBase64 || false,
      events: webhookData.events || [
        "QRCODE_UPDATED",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "SEND_MESSAGE",
        "CONNECTION_UPDATE"
      ]
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/webhook/set/${instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao configurar webhook: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      throw error;
    }
  }

  /**
   * Envia uma mensagem de texto
   * @param {string} instanceName Nome da instância
   * @param {string} number Número do destinatário (com código do país)
   * @param {string} text Texto da mensagem
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendText(instanceName, number, text) {
    const data = {
      number,
      text,
      delay: 1000  // 1 segundo de atraso para evitar bloqueios
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Envia uma mensagem com mídia (imagem, vídeo, documento, etc)
   * @param {string} instanceName Nome da instância
   * @param {string} number Número do destinatário (com código do país)
   * @param {string} caption Legenda da mídia
   * @param {string} mediaUrl URL da mídia
   * @param {string} mediaType Tipo de mídia (image, video, document, etc)
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendMedia(instanceName, number, caption, mediaUrl, mediaType = 'image') {
    const data = {
      number,
      caption,
      media: mediaUrl,
      mediatype: mediaType,
      delay: 1000  // 1 segundo de atraso para evitar bloqueios
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/message/sendMedia/${instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar mídia: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      throw error;
    }
  }

  /**
   * Envia uma mensagem de lista com opções
   * @param {string} instanceName Nome da instância
   * @param {string} number Número do destinatário
   * @param {string} title Título da lista
   * @param {string} description Descrição da lista
   * @param {string} buttonText Texto do botão
   * @param {Array} sections Seções e itens da lista
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendList(instanceName, number, title, description, buttonText, sections) {
    const data = {
      number,
      title,
      description,
      buttonText,
      sections,
      delay: 1000  // 1 segundo de atraso para evitar bloqueios
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/message/sendList/${instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar lista: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar lista:', error);
      throw error;
    }
  }

  /**
   * Verifica se um número está registrado no WhatsApp
   * @param {string} instanceName Nome da instância
   * @param {string} number Número a verificar (com código do país)
   * @returns {Promise<Object>} Resultado da verificação
   */
  async checkIsWhatsApp(instanceName, number) {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/whatsappNumbers/${instanceName}?numbers=${number}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao verificar número: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar número no WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Obtém todas as instâncias cadastradas
   * @returns {Promise<Object>} Lista de instâncias
   */
  async getAllInstances() {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar instâncias: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
      throw error;
    }
  }

  /**
   * Desconecta (logout) uma instância
   * @param {string} instanceName Nome da instância
   * @returns {Promise<Object>} Resultado do logout
   */
  async logoutInstance(instanceName) {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/logout/${instanceName}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao desconectar instância: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
      throw error;
    }
  }

  /**
   * Remove uma instância
   * @param {string} instanceName Nome da instância
   * @returns {Promise<Object>} Resultado da remoção
   */
  async deleteInstance(instanceName) {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/delete/${instanceName}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao remover instância: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao remover instância:', error);
      throw error;
    }
  }
}

// Exportar uma instância do serviço
const evolutionApiService = new EvolutionApiService();
export default evolutionApiService;

// Exportar a classe caso seja necessário criar instâncias customizadas
export { EvolutionApiService };