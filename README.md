# Audio Teams

App leve para gravar um áudio e compartilhar diretamente em um chat/canal do Microsoft Teams, como uma aba pessoal (personal tab).

Sem backend, sem chave de API, sem registro no Azure AD. Só HTML/CSS/JS puro rodando no navegador (WebView do Teams).

## Como funciona

1. Grava o áudio pelo microfone (`MediaRecorder`).
2. Mostra o preview para ouvir antes de enviar.
3. Ao clicar em **Compartilhar**, tenta abrir o menu nativo de compartilhamento do Windows/Teams (`navigator.share`), onde você escolhe o chat/canal de destino.
4. Se o navegador não suportar compartilhamento de arquivo, aparece o botão **Baixar áudio** — baixe e anexe manualmente no chat.

## Testar localmente

```powershell
npx serve .
```

Abra a URL local no navegador (Edge/Chrome) e teste gravar/compartilhar. `localhost` já é tratado como contexto seguro, então o microfone funciona sem HTTPS.

## Publicar (GitHub Pages)

1. Suba este repositório (`Audio-Teams`) para o GitHub.
2. Em **Settings → Pages**, habilite o Pages na branch `main`, pasta raiz (`/`).
3. Anote a URL gerada, algo como `https://SEU-USUARIO.github.io/Audio-Teams/`.
4. Edite `manifest/manifest.json` e troque todas as ocorrências de `SEU-USUARIO.github.io` pelo domínio real do seu Pages.
5. Gere um novo `id` (GUID) no manifest, por exemplo com `[guid]::NewGuid()` no PowerShell.

## Instalar no Teams (sideload)

1. Compacte os arquivos dentro de `manifest/` (`manifest.json`, `color.png`, `outline.png`) em um `.zip` — os 3 arquivos direto na raiz do zip, sem subpasta.
2. No Teams, vá em **Apps → Gerenciar seus apps → Enviar um aplicativo personalizado** (pode exigir que o admin de TI habilite o sideload de apps personalizados no Teams Admin Center).
3. Selecione o `.zip` gerado.
4. Abra o app — ele carrega a aba com a URL do GitHub Pages.

## Observações

- O compartilhamento direto (`navigator.share` com arquivo) funciona no WebView2 usado pelo novo cliente Teams no Windows 11. Em outros ambientes (ex: navegador sem suporte), use o fallback de download.
- Não há coleta ou armazenamento de áudio em nenhum servidor — tudo acontece no navegador do usuário.
