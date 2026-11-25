#!/bin/sh
# Marca uma versão nova do site antes de publicar. As páginas comparam a versão delas com version.txt
# (lido sem cache) e, se estiverem velhas no cache do navegador, recarregam sozinhas com ?v=<versão>.
# Uso: sh scripts/versao.sh   (rode na raiz do repositório, antes do commit)
set -e
V=$(date -u +%Y%m%d%H%M)
printf '%s\n' "$V" > version.txt
for f in index.html aluno.html admin.html login.html; do
  [ -f "$f" ] && sed -i "s/window.FOS_BUILD='[0-9a-z]*'/window.FOS_BUILD='$V'/" "$f"
done
echo "versão $V"
