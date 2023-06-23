export const catchDataMessage = (message: ArrayBuffer) => {
  const msg = message.toString();

  const payload = msg.split("#")[1].split("$")[0];
  return { payload, idp: payload.split("-")[0] };
};
