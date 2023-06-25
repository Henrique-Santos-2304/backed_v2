export const splitMsgCloud = (message: string) => {
  const withoutHash = message.split("#");

  if (withoutHash?.length <= 0) {
    throw new Error("Padrão de mensagem inválido! ");
  }

  const withoutCash = withoutHash[1].split("$");

  if (!withoutCash[0]) {
    throw new Error("Padrão de mensagem inválido! ");
  }

  const toList = withoutCash[0].split("-");

  return { toList, msg: toList.join("-"), idp: toList[0] };
};
