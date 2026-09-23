# Segurança de dependências

O CI executa `npm audit --audit-level=high` depois de `npm ci`. Advisory **high** ou **critical** falha o job. Advisory **low** ou **moderate** aparece no log e não bloqueia o merge.

O `npm ci` do Dev Container usa `--no-audit` de propósito: o arranque local não depende da API de advisories. O Dockerfile de produção também não roda `npm audit`. O gate é o CI.

## Atualizar

Uma mudança de dependência entra por PR para `nonprod` e precisa passar no CI existente: typecheck, lint, format, testes e build.

Não use `npm audit fix --force`. Esse comando pode subir ou descer versões fora da faixa declarada, inclusive majors incompatíveis. Atualize o intervalo em `package.json` e o `package-lock.json` de forma explícita.

Alertas moderate ou low ficam registrados até uma atualização deliberada. Se a única correção publicada for um bump major, ou um downgrade, ela não é aplicada só para limpar o audit.

## Automação futura

O próximo passo, ainda não habilitado, é o Dependabot do GitHub: PRs semanais de atualização contra `nonprod`, sem auto-merge. Cada PR continua sujeito ao mesmo CI. Não há scanner pago além do `npm audit` e dos alertas nativos do GitHub.
