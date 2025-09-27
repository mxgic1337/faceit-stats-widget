# Adicionando Mapas do Counter-Strike 2

Este documento explica como adicionar imagens dos mapas do Counter-Strike 2 ao widget.

## Mapas Adicionados

Os seguintes mapas foram adicionados ao sistema de previews:

1. **Dust2** - `dust2.png`
2. **Inferno** - `inferno.png`
3. **Overpass** - `overpass.png`
4. **Vertigo** - `vertigo.png`
5. **Cache** - `cache.png`
6. **Train** - `train.png`
7. **Cobblestone** - `cobblestone.png`
8. **Anubis** - `anubis.png`

## Como Adicionar as Imagens

Para que os mapas funcionem corretamente, você precisa substituir os arquivos placeholder na pasta `src/assets/previews/` por imagens reais dos mapas.

### Especificações das Imagens

- **Formato**: PNG
- **Dimensões recomendadas**: 1920x1080 ou similar
- **Qualidade**: Alta resolução para melhor visualização
- **Estilo**: Screenshots ou artwork oficial dos mapas

### Passos para Adicionar as Imagens

1. Obtenha imagens dos mapas do Counter-Strike 2
2. Redimensione as imagens para as dimensões recomendadas
3. Salve as imagens como PNG na pasta `src/assets/previews/`
4. Substitua os arquivos placeholder pelos arquivos de imagem reais

### Arquivos que Precisam ser Substituídos

```
src/assets/previews/
├── dust2.png
├── inferno.png
├── overpass.png
├── vertigo.png
├── cache.png
├── train.png
├── cobblestone.png
└── anubis.png
```

## Traduções

As traduções para os novos mapas foram adicionadas em todos os idiomas suportados:

- Inglês (english.json)
- Português Brasileiro (pt-br.json)
- Espanhol (spanish.json)
- Alemão (german.json)
- Polonês (polish.json)

## Funcionalidades

- Os novos mapas aparecem no seletor de preview do widget
- Cada mapa tem seu próprio estilo de fundo
- As traduções são aplicadas automaticamente baseadas no idioma selecionado
- Compatível com todos os temas e esquemas de cores existentes

## Notas Técnicas

- Os imports das imagens foram adicionados ao `Generator.tsx`
- Os estilos CSS foram atualizados para incluir os novos mapas
- A lista de previews foi expandida para incluir todos os mapas
- As traduções seguem o padrão `generator.preview.{nome_do_mapa}`
