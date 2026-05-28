import Head from 'next/head'
import Link from 'next/link'

export default function Termos() {
  const S: React.CSSProperties = { fontFamily: 'Oswald, sans-serif' }

  return (
    <>
      <Head>
        <title>Termos de Uso — FigurinhaTracker</title>
        <meta name="description" content="Termos de uso do FigurinhaTracker." />
      </Head>
      <div style={{ minHeight: '100vh', padding: '2rem 1.25rem', maxWidth: 430, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#00c850', fontSize: '.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.375rem', marginBottom: '2rem' }}>
          ← Voltar
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>📋</div>
          <h1 style={{ ...S, fontSize: '1.75rem', fontWeight: 700, color: '#ffd60a', letterSpacing: '.1em', margin: 0 }}>TERMOS DE USO</h1>
          <p style={{ color: '#6b93b8', fontSize: '.75rem', marginTop: '.5rem' }}>Atualizado em 28 de maio de 2026</p>
        </div>

        <div style={{ color: '#a0c0d8', lineHeight: 1.75, fontSize: '.9375rem' }}>
          <Section title="1. O que é o FigurinhaTracker">
            <p>FigurinhaTracker é um app gratuito para você gerenciar sua coleção de figurinhas do álbum oficial Panini da Copa do Mundo FIFA 2026. Ele não tem vínculo com a Panini, a FIFA ou qualquer patrocinador oficial.</p>
          </Section>

          <Section title="2. Conta e acesso">
            <ul>
              <li>Você precisa de uma conta para usar o app.</li>
              <li>Mantenha suas credenciais seguras. Você é responsável por atividades na sua conta.</li>
              <li>Uma conta por pessoa. Contas compartilhadas ou automatizadas não são permitidas.</li>
            </ul>
          </Section>

          <Section title="3. Plano gratuito e limites">
            <p>O plano gratuito inclui:</p>
            <ul>
              <li>Gerenciamento ilimitado de figurinhas (marcar, desmarcar, exportar).</li>
              <li>Até <strong>50 análises por IA por mês</strong> (escaneamento automático por câmera/imagem).</li>
              <li>Acesso a todas as conquistas e compartilhamento social.</li>
            </ul>
            <p>O limite de 50 scans existe para manter o serviço gratuito sem sobrecarregar os custos. Digitação manual de códigos não tem limite.</p>
          </Section>

          <Section title="4. Uso aceitável">
            <p>Você concorda em não:</p>
            <ul>
              <li>Tentar burlar os limites de uso (automação, múltiplas contas, etc).</li>
              <li>Usar o app para fins ilegais ou prejudicar outros usuários.</li>
              <li>Fazer engenharia reversa ou tentar acessar partes restritas do sistema.</li>
            </ul>
          </Section>

          <Section title="5. Conteúdo e dados">
            <ul>
              <li>Os dados da sua coleção são seus. Você pode exportar e excluir tudo a qualquer hora.</li>
              <li>Imagens enviadas para análise são processadas e descartadas imediatamente — não ficam armazenadas.</li>
            </ul>
          </Section>

          <Section title="6. Disponibilidade">
            <p>O FigurinhaTracker é um projeto pessoal, oferecido como está, sem garantia de disponibilidade contínua. Faremos o melhor para manter o app no ar, mas não nos responsabilizamos por interrupções.</p>
          </Section>

          <Section title="7. Encerramento de conta">
            <p>Você pode excluir sua conta a qualquer momento pelo perfil. Todos os seus dados são removidos permanentemente em até 30 dias.</p>
            <p>Podemos suspender contas que violem estes termos.</p>
          </Section>

          <Section title="8. Alterações nos termos">
            <p>Podemos atualizar estes termos. Avisaremos por email se houver mudanças relevantes. O uso continuado após a notificação indica concordância.</p>
          </Section>

          <Section title="9. Contato">
            <p>Dúvidas? Fale pelo email: <a href="mailto:pedrophslima@gmail.com" style={{ color: '#00c850' }}>pedrophslima@gmail.com</a></p>
          </Section>
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e3a5a', textAlign: 'center' }}>
          <Link href="/privacidade" style={{ color: '#6b93b8', fontSize: '.875rem' }}>Ver Política de Privacidade →</Link>
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
