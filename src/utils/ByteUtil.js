// UTF-8 인코딩 방식에서 byte size
const getByteSize = s => {
  let byteSize = 0;
  if (!s) {
    return byteSize;
  }
  const str = s.toString();
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byteSize += _getByteSize(code);
  }
  return byteSize;
};

/**
 * 문자열을 byte 단위로 자르는 함수
 * byteLength 이하의 substring 반환
 * @param text
 * @param byteLength
 * @returns {*|string}
 */
const curtailTextInBytes = (text, byteLength) => {
  const APPEND_END_SUFFIX = "...";
  if (!text || getByteSize(text) <= byteLength) {
    return text;
  }
  let str = text.toString();
  let cnt = 0;
  for (let i = 0; i < str.length; i++) {
    cnt += _getByteSize(str.charCodeAt(i));
    if (cnt > byteLength) {
      return [...str].slice(0, i).join("") + APPEND_END_SUFFIX;
    }
  }
};

const _getByteSize = code => {
  if (code <= 0x7f) {
    return 1;
  } else if (code <= 0x7ff) {
    return 2;
  } else if (code < 0xffff) {
    return 3;
  } else {
    return 4;
  }
};

export default { getByteSize, curtailTextInBytes };
