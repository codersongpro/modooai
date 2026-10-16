// 글자 크기 저장 키와 첫 화면용 초기화 스크립트.
// 서버 레이아웃에서도 읽어야 해서 "use client" 파일과 따로 둔다.

export const FONT_KEY = "modooai:font-scale";

// 화면이 그려지기 전에 실행해서 저장한 글자 크기를 깜빡임 없이 적용한다.
export const FONT_INIT_SCRIPT = `try{var s=localStorage.getItem("${FONT_KEY}");if(s==="1"||s==="2")document.documentElement.dataset.scale=s}catch(e){}`;
