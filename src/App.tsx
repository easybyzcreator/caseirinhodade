import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Admin from './components/Admin';
import Footer from './components/Footer';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Settings } from './types';
import { Toaster } from 'sonner';
import { ensureDefaultCatalogSeeded } from './lib/catalogInit';
import { parseMoneyValue } from './lib/money';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    logo: 'https://i.ibb.co/21D9nbnL/Gemini-Generated-Image-h3sso8h3sso8h3ss.jpg',
    primaryColor: '#424733',
    whatsappNumber: '(19) 99747-4575',
    whatsappCountryCode: '+55',
    slug: 'caseirinho-da-de',
    brandName: 'Caseirinho da Dê',
    slogan: 'Alimentação saudável e consciente.',
    whatsappClosingMessage: '*Nota* Obrigado pelo seu pedido! Em breve entraremos em contato para confirmação.\n\n*Obs:* Para validar sua encomenda, efetue o pagamento de 50% do valor e nos envie o comprovante.\n*Chave Pix:* @meupix',
    backgroundImage: 'https://i.ibb.co/X0vYy7L/cakes.png',
    glassColor: 'rgba(255, 255, 255, 0.4)',
    textColor: '#000000',
    categoryTextColor: '#424733',
    brandNameColor: '#424733',
    detailsPriceColor: '#865d39',
    showCustomDietButton: true,
    showDetoxInstructionsButton: true,
    showStorageInstructionsButton: true,
    minOrderValue: 150,
    language: 'pt',
    currency: 'BRL',
    introEnabled: true,
    introTitle: 'Caseirinho da Dê',
    introSubtitle: 'Comer bem é o primeiro passo para uma vida saudável.',
    introDescription: 'Se você quer mais leveza, mais saúde e mais qualidade de vida... comece pelo básico bem feito: sua alimentação.',
    introButtonText: 'ACESSAR NOSSO CARDÁPIO',
    introBottomText: 'ALIMENTO • CORPO • ALMA',
    selectorEnabled: true,
    selectorTitle: 'Caseirinho da Dê',
    selectorSubtitle: '',
    catalog1Title: 'Caseirinho da Dê',
    catalog1Image: 'https://i.ibb.co/21D9nbnL/Gemini-Generated-Image-h3sso8h3sso8h3ss.jpg',
    catalog1Desc: 'Nossas opções saudáveis e nutritivas.',
    catalog1Slogan: 'Alimentação saudável e consciente\nSua refeição proteica à base de plantas, preparada com ingredientes selecionados para unir sabor, praticidade e equilíbrio.\nSem glúten intencional\nZero lactose e aditivos\nPronta em apenas 6 minutos\nPronta entrega (Consulte os sabores disponíveis em estoque).\nEntregas (Dias e horários a combinar)\nPagamento: Realizado no momento do pedido via Pix\n',
    catalog1Active: true,
    checkoutTitle: 'Falta pouco para concluir seu pedido!',
    infoBlock1Title: 'Regras de Entrega e Retirada',
    infoBlock1Text: 'Lembre-se: pedidos até dia 10/09 com entrega dia 17/09. \nA taxa de entrega é calculada de acordo com sua região.',
    infoBlock2Title: 'Confirmação do Pagamento',
    infoBlock2Text: 'Para efetivar seu pedido, realize o pagamento. A chave Pix, ou link para pagamento com cartão de crédito, será enviado junto com o resumo do pedido na mensagem. Envie o comprovante para garantir sua encomenda!',
    catalog2Title: 'Bebidas & Doces Fit',
    catalog2Image: 'https://i.ibb.co/X0vYy7L/cakes.png',
    catalog2Desc: 'Sucos naturais, smoothies e sobremesas sem açúcar.',
    catalog2Slogan: 'Refrescância e dulçor saudável para o seu dia',
    catalog2Active: false,
    catalog3Title: 'Dietas Low Carb',
    catalog3Image: 'https://i.ibb.co/X0vYy7L/cakes.png',
    catalog3Desc: 'Pratos com baixo teor de carboidratos e ricos em proteínas.',
    catalog3Slogan: 'Mais foco na sua saúde e energia',
    catalog3Active: false,
    catalog4Title: 'Dietas Hipertróficas',
    catalog4Image: 'https://i.ibb.co/X0vYy7L/cakes.png',
    catalog4Desc: 'Refeições com alto teor calórico saudável e ricas em proteínas para ganho de massa.',
    catalog4Slogan: 'Combustível de alta qualidade para o seu treino',
    catalog4Active: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL for admin path
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
      setIsAdmin(true);
    }

    // Ensure initial default catalog is safely seeded in Firebase
    ensureDefaultCatalogSeeded();

    // Load settings for global styles
    const unsub = onSnapshot(doc(db, 'configuracoes', 'geral'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Settings;
        if (!data.whatsappCountryCode || data.whatsappCountryCode !== '+55') {
          data.whatsappCountryCode = '+55';
        }
        if (data.minOrderValue !== undefined && data.minOrderValue !== null) {
          data.minOrderValue = parseMoneyValue(data.minOrderValue);
        }
        setSettings(prev => ({ ...prev, ...data }));
        setLoading(false);

        // Update Page Title
        if (data.brandName) {
          document.title = data.brandName;
        }

        // Update Theme Color
        const themeColorMeta = document.getElementById('theme-color');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', data.primaryColor || '#865d39');
        }

        // Set Glass Color CSS Variable
        const glassColor = data.glassColor || 'rgba(255, 255, 255, 0.4)';
        const finalGlassColor = (glassColor.startsWith('#') && glassColor.length === 7) 
          ? `${glassColor}66` 
          : glassColor;
        document.documentElement.style.setProperty('--glass-color', finalGlassColor);

        // Set Text Color CSS Variable
        if (data.textColor) {
          document.documentElement.style.setProperty('--text-color', data.textColor);
        }
      } else {
        setLoading(false);
      }
    }, (error) => {
      console.error('App: Erro ao carregar configurações:', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const glassColor = settings?.glassColor || 'rgba(255, 255, 255, 0.4)';
  const finalGlassColor = (glassColor.startsWith('#') && glassColor.length === 7) 
    ? `${glassColor}66` 
    : glassColor;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#ece6db]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#865d39] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#865d39] font-medium animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Toaster position="top-center" richColors />
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${settings?.backgroundImage || 'https://i.ibb.co/X0vYy7L/cakes.png'}")` }}
      />
      
      {/* Glass Overlay */}
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none" 
        style={{ 
          backgroundColor: finalGlassColor,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      />

      {/* Content */}
      <div className="relative z-0 flex flex-col min-h-screen">
        {isAdmin ? (
          <Admin settings={settings} setSettings={setSettings} setIsAdmin={setIsAdmin} />
        ) : (
          <>
            <Menu settings={{ ...settings, language: 'pt', currency: 'BRL' }} />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
