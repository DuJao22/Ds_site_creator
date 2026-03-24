import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleVerifyAndSave = async () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setErrorMessage('A chave da API não pode estar vazia.');
      return;
    }

    setIsValidating(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      // Test the key with a minimal request
      await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Responda apenas com a palavra "OK".'
      });

      localStorage.setItem('gemini_api_key', apiKey.trim());
      setStatus('success');
    } catch (error: any) {
      console.error("API Key validation error:", error);
      setStatus('error');
      setErrorMessage(error.message || 'Chave API inválida ou sem permissão.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold leading-7 text-zinc-900 sm:text-3xl sm:truncate">
          Configurações
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Gerencie suas chaves de API e preferências do sistema.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-zinc-500" />
          Google Gemini API Key
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Insira sua chave de API do Google Gemini para habilitar a geração automática de conteúdo usando Inteligência Artificial.
          </p>
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-700 mb-1">
              Chave da API
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatus('idle');
              }}
              placeholder="AIzaSy..."
              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleVerifyAndSave}
              disabled={isValidating || !apiKey}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar e Salvar'
              )}
            </button>

            {status === 'success' && (
              <span className="flex items-center text-sm text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4 mr-1" /> Chave válida e salva!
              </span>
            )}
            
            {status === 'error' && (
              <span className="flex items-center text-sm text-red-600 font-medium">
                <XCircle className="w-4 h-4 mr-1" /> {errorMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
