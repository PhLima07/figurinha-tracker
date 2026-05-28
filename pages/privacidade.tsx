import Head from 'next/head'
import Link from 'next/link'

export default function Privacidade() {
  const S: React.CSSProperties = { fontFamily: 'Oswald, sans-serif' }

  return (
    <>
      <Head>
        <title>Política de Privacidade — FigurinhaTracker</title>
        <meta name="description" content="Como o FigurinhaTracker usa e protege seus dados pessoais." />
      </Head>
      <div style={{ minHeight: '100vh', padding: '2rem 1.25rem', maxWidth: 430, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#00c850', fontSize: '.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.375rem', marginBottom: '2rem' }}>
          ← Voltar
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>🔒</div>
          <h1 style={{ ...S, fontSize: '1.75rem', fontWeight: 700, color: '#ffd60a', letterSpacing: '.1em', margin: 0 }}>PRIVACIDADE</h1>
          <p style={{ color: '#6b93b8', fontSize: '.75rem', marginTop: '.5rem' }}>Atualizado em 28 de maio de 2026</p>
        </div>

        <div style={{ color: '#a0c0d8', lineHeight: 1.75, fontSize: '.9375rem' }}>
          <Section title="1. Quais dados coletamos">
            <p>Coletamos apenas o mínimo necessário para o app funcionar:</p>
            <ul>
              <li><strong>Nome e email</strong> — para criar sua conta e identificar você.</li>
              <li><strong>Lista de figurinhas</strong> — os códigos (ex: BRA-07) que você marca como tendo ou faltando.</li>
              <li><strong>Imagens enviadas para análise</strong> — processadas na hora e <strong>descartadas imediatamente</strong>. Não armazenamos nenhuma foto sua.</li>
            </ul>
          </Section>

          <Section title="2. Como usamos seus dados">
            <ul>
              <li>Para mostrar sua coleção e progresso no álbum.</li>
              <li>Para analisar fotos de figurinhas com inteligência artificial (Claude Vision) e identificar automaticamente o código da figurinha.</li>
              <li>Não vendemos, não compartilhamos e não usamos seus dados para publicidade.</li>
            </ul>
          </Section>

          <Section title="3. Imagens e câmera">
            <p>Quando você fotografa uma figurinha:</p>
            <ul>
              <li>A imagem é convertida para JPEG (removemos metadados como localização).</li>
              <li>Ela é enviada para análise e o resultado é retornado imediatamente.</li>
              <li>A imagem é descartada — não fica salva em nenhum servidor.</li>
            </ul>
          </Section>

          <Section title="4. Cookies e autenticação">
            <p>Usamos cookies seguros (<code>httpOnly</code>) apenas para manter você logado. Não usamos cookies de rastreamento ou publicidade.</p>
          </Section>

          <Section title="5. Seus direitos (LGPD)">
            <p>Pela Lei Geral de Proteção de Dados, você tem direito a:</p>
            <ul>
              <li><strong>Acessar</strong> seus dados — exporte sua coleção em CSV pelo perfil.</li>
              <li><strong>Corrigir</strong> seus dados — edite seu nome no perfil a qualquer hora.</li>
              <li><strong>Excluir</strong> tudo — botão "Excluir minha conta" no perfil apaga seus dados permanentemente.</li>
            </ul>
          </Section>

          <Section title="6. Segurança">
            <p>Seus dados ficam no Supabase (infraestrutura na AWS), com criptografia em trânsito (HTTPS) e controles de acesso que garantem que só você vê sua coleção.</p>
          </Section>

          <Section title="7. Menores de idade">
            <p>Perfis de menores de 18 anos são privados por padrão. Se você é responsável por uma criança usando o app, pode excluir a conta a qualquer momento.</p>
          </Section>

          <Section title="8. Contato">
            <p>Dúvidas ou solicitações sobre seus dados? Fale pelo email: <a href="mailto:pedrophslima@gmail.com" style={{ color: '#00c850' }}>pedrophslima@gmail.com</a></p>
          </Section>
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e3a5a', textAlign: 'center' }}>
          <Link href="/termos" style={{ color: '#6b93b8', fontSize: '.875rem' }}>Ver Termos de Uso →</Link>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#00c850', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
        {title}
      </h2>
      <div style={{ paddingLeft: '.25rem' }}>{children}</div>
    </div>
  )
}
